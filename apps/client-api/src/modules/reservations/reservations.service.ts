import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Model, Types } from 'mongoose';
import { Reservation } from './reservation.schema';
import { CreateReservationDto, PassengerDto } from './dto/create-reservation.dto';
import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service';
import {
  getCitizenIdPepper,
  hashCitizenIdForStorage,
  normalizeTurkishCitizenId,
} from '../../common/privacy/sensitive-identifiers';

@Injectable()
export class ReservationsService {
  private readonly logger = new Logger(ReservationsService.name);

  constructor(
    @InjectModel(Reservation.name) private readonly reservationModel: Model<Reservation>,
    private readonly adminNotificationsService: AdminNotificationsService,
    @InjectQueue('reservation-confirmation') private readonly confirmationQueue: Queue,
  ) {}

  /** Geçersiz JWT memberId BSON cast hatası → 500 üretmesin */
  private safeMemberObjectId(memberId: string | undefined): Types.ObjectId | null {
    const id = memberId?.trim();
    if (!id) return null;
    if (!Types.ObjectId.isValid(id)) {
      this.logger.warn(`Geçersiz memberId, null yazılıyor: ${id}`);
      return null;
    }
    return new Types.ObjectId(id);
  }

  /** Gateway bazen paymentId’yi string dışında veya boşluklu gönderir; DB’de tek tip tutulur. */
  private normalizePaymentId(paymentId: string | undefined): string | undefined {
    if (paymentId == null || paymentId === '') return undefined;
    return String(paymentId).trim();
  }

  private dtoWithNormalizedPayment(dto: CreateReservationDto): CreateReservationDto {
    const pid = this.normalizePaymentId(dto.payment?.paymentId);
    if (!dto.payment || !pid) return dto;
    return {
      ...dto,
      payment: { ...dto.payment, paymentId: pid },
    };
  }

  /**
   * TCKN için HMAC-SHA256 türetir; isteğe bağlı RESERVATION_REDACT_PLAIN_CITIZEN=true ile düz TCKN yazılmaz.
   * İstemciden gelen citizenNoSha256 yok sayılır, sunucuda yeniden hesaplanır.
   */
  private applyPassengerPrivacy(dto: CreateReservationDto): CreateReservationDto {
    const passengers = dto.passengers;
    if (!passengers?.length) return dto;
    const pepper = getCitizenIdPepper();
    const redactPlain = process.env.RESERVATION_REDACT_PLAIN_CITIZEN === 'true';

    const next = passengers.map((raw) => {
      const { citizenNoSha256: _ignored, ...p } = raw as PassengerDto & {
        citizenNoSha256?: string;
      };
      const norm = normalizeTurkishCitizenId(p.citizenNo);
      const citizenNoSha256 = norm ? hashCitizenIdForStorage(norm, pepper) : undefined;
      let citizenNo = p.citizenNo;
      if (redactPlain && norm) citizenNo = undefined;
      return { ...p, citizenNo, citizenNoSha256 };
    });

    return { ...dto, passengers: next };
  }

  private isMongooseValidationError(err: unknown): boolean {
    return (
      typeof err === 'object' &&
      err !== null &&
      'name' in err &&
      (err as { name: string }).name === 'ValidationError'
    );
  }

  /** update/save Mongoose ValidationError → 400 (yoksa 500 + opak hata) */
  private async runReservationWrite<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (err: unknown) {
      if (this.isMongooseValidationError(err)) {
        const msg = err instanceof Error ? err.message : 'Doğrulama hatası';
        this.logger.warn(`Rezervasyon şema doğrulaması: ${msg}`);
        throw new BadRequestException(msg);
      }
      throw err;
    }
  }

  /**
   * Önce aynı ödeme oturumu (paymentId) varsa güncelle — 3D öncesi PENDING kaydı finalize ile
   * gerçek PNR’ye veya başarısızlıkta PAYMENT_FAILED’a dönüşür.
   * Sonra bookingCode ile idempotent davranış (çift callback).
   */
  async create(dto: CreateReservationDto, memberId?: string): Promise<Reservation> {
    const dtoNorm = this.applyPassengerPrivacy(this.dtoWithNormalizedPayment(dto));
    const payId = this.normalizePaymentId(dtoNorm.payment?.paymentId);

    if (payId) {
      const byPaymentId = await this.reservationModel
        .findOne({ 'payment.paymentId': payId })
        .exec();
      if (byPaymentId) {
        return this.runReservationWrite(() =>
          this.updateByDocumentId(byPaymentId, dtoNorm, memberId),
        );
      }
    }

    // Ödeme sayfasına girildiğinde PRE-… kaydı; init3D’de PAY-… + paymentId — aynı shoppingFileId’de tek satır
    if (
      dtoNorm.shoppingFileId &&
      dtoNorm.status &&
      ['PENDING', 'PAYMENT_FAILED'].includes(dtoNorm.status)
    ) {
      const openByShoppingFile = await this.reservationModel
        .findOne({
          shoppingFileId: dtoNorm.shoppingFileId,
          status: { $in: ['PENDING', 'PAYMENT_FAILED'] },
        })
        .sort({ updatedAt: -1 })
        .exec();
      if (openByShoppingFile) {
        this.logger.log(
          `Rezervasyon güncelleniyor (shoppingFileId, açık ödeme): ${dtoNorm.shoppingFileId}`,
        );
        return this.runReservationWrite(() =>
          this.updateByDocumentId(openByShoppingFile, dtoNorm, memberId),
        );
      }
    }

    const existing = await this.reservationModel
      .findOne({ bookingCode: dtoNorm.bookingCode })
      .exec();

    if (existing) {
      return this.runReservationWrite(() => this.updateByBookingCode(dtoNorm, memberId, existing));
    }

    try {
      const doc = new this.reservationModel(this.buildReservationDoc(dtoNorm, memberId, null));
      const saved = await this.runReservationWrite(() => doc.save());
      this.logger.log(
        `Rezervasyon kaydedildi: ${saved.bookingCode} | status: ${saved.status} | memberId: ${memberId ?? 'guest'}`,
      );
      if (saved.status !== 'PAYMENT_FAILED' && saved.status !== 'PENDING') {
        void this.adminNotificationsService.recordNewReservation({
          bookingCode: saved.bookingCode,
          reservationId: String((saved as any)._id),
        });
      }
      if (saved.status === 'CONFIRMED') {
        void this.enqueueConfirmationEmail(saved, dtoNorm);
      }
      return saved;
    } catch (err: unknown) {
      const code = (err as { code?: number })?.code;
      if (code === 11000 && payId) {
        const byPay = await this.reservationModel
          .findOne({ 'payment.paymentId': payId })
          .exec();
        if (byPay) {
          this.logger.warn(`E11000 sonrası paymentId ile birleştiriliyor: ${payId}`);
          return this.runReservationWrite(() =>
            this.updateByDocumentId(byPay, dtoNorm, memberId),
          );
        }
      }
      if (
        code === 11000 &&
        dtoNorm.shoppingFileId &&
        dtoNorm.status &&
        ['PENDING', 'PAYMENT_FAILED'].includes(dtoNorm.status)
      ) {
        const openBySf = await this.reservationModel
          .findOne({
            shoppingFileId: dtoNorm.shoppingFileId,
            status: { $in: ['PENDING', 'PAYMENT_FAILED'] },
          })
          .sort({ updatedAt: -1 })
          .exec();
        if (openBySf) {
          this.logger.warn(`E11000 sonrası shoppingFileId ile birleştiriliyor: ${dtoNorm.shoppingFileId}`);
          return this.runReservationWrite(() =>
            this.updateByDocumentId(openBySf, dtoNorm, memberId),
          );
        }
      }
      if (code === 11000 && dtoNorm.bookingCode) {
        const again = await this.reservationModel
          .findOne({ bookingCode: dtoNorm.bookingCode })
          .exec();
        if (again) {
          this.logger.warn(
            `Rezervasyon duplicate key (yarış); güncelleniyor: ${dtoNorm.bookingCode}`,
          );
          return this.runReservationWrite(() =>
            this.updateByBookingCode(dtoNorm, memberId, again),
          );
        }
      }
      throw err;
    }
  }

  private mergePayment(
    previous: Reservation['payment'] | undefined,
    incoming: CreateReservationDto['payment'] | undefined,
  ): Record<string, unknown> | undefined {
    if (!incoming && !previous) return undefined;
    const prev = (previous as Record<string, unknown>) || {};
    const inc = (incoming as Record<string, unknown>) || {};
    return { ...prev, ...inc };
  }

  private async updateByDocumentId(
    existing: Reservation,
    dto: CreateReservationDto,
    memberId: string | undefined,
  ): Promise<Reservation> {
    const prevStatus = existing.status;
    const nextStatus = dto.status ?? existing.status ?? 'CONFIRMED';
    const $set: Record<string, unknown> = {
      bookingCode: dto.bookingCode,
      reservationNo: dto.bookingCode,
      status: nextStatus,
      type: dto.type ?? existing.type ?? 'flight',
    };
    if (memberId) {
      $set.memberId = this.safeMemberObjectId(memberId);
    }
    if (dto.flight !== undefined) $set.flight = dto.flight;
    if (dto.flightLegs !== undefined) $set.flightLegs = dto.flightLegs;
    if (dto.passengers !== undefined) $set.passengers = dto.passengers;
    const mergedPay = this.mergePayment(existing.payment, dto.payment);
    if (mergedPay !== undefined) $set.payment = mergedPay;
    if (dto.shoppingFileId !== undefined) $set.shoppingFileId = dto.shoppingFileId;
    if (dto.totalFare !== undefined) $set.totalFare = dto.totalFare;
    if (dto.currency !== undefined) $set.currency = dto.currency;
    if (dto.correlationId !== undefined) $set.correlationId = dto.correlationId;
    if (dto.failureReason !== undefined) $set.failureReason = dto.failureReason;
    if (nextStatus === 'CONFIRMED') {
      $set.failureReason = null;
    }

    // CONFIRMED kesin kayıt: tam şema doğrulaması. PENDING/PAYMENT_FAILED: eski kayıtta kısmi flight vb. varsa tam belge validasyonu 500 üretebiliyor.
    const runValidators = nextStatus === 'CONFIRMED';

    let saved: Reservation | null;
    try {
      saved = await this.reservationModel
        .findByIdAndUpdate((existing as any)._id, { $set }, { new: true, runValidators })
        .exec();
    } catch (err: unknown) {
      const code = (err as { code?: number })?.code;
      if (code === 11000 && dto.bookingCode) {
        const canonical = await this.reservationModel.findOne({ bookingCode: dto.bookingCode }).exec();
        if (canonical && String((canonical as any)._id) !== String((existing as any)._id)) {
          this.logger.warn(
            `bookingCode E11000 (findByIdAndUpdate); hedef belgeye merge: ${dto.bookingCode}`,
          );
          return this.updateByBookingCode(dto, memberId, canonical);
        }
      }
      throw err;
    }
    if (!saved) {
      throw new Error(`Rezervasyon güncellenemedi (paymentId): ${dto.payment?.paymentId}`);
    }
    this.logger.log(
      `Rezervasyon güncellendi (paymentId): ${saved.bookingCode} | status: ${saved.status}`,
    );
    if (saved.status === 'CONFIRMED' && prevStatus !== 'CONFIRMED') {
      void this.adminNotificationsService.recordNewReservation({
        bookingCode: saved.bookingCode,
        reservationId: String((saved as any)._id),
      });
      void this.enqueueConfirmationEmail(saved, dto);
    }
    return saved;
  }

  private buildReservationDoc(
    dto: CreateReservationDto,
    memberId: string | undefined,
    memberIdOverride: Types.ObjectId | null | undefined,
  ): Record<string, unknown> {
    const doc: Record<string, unknown> = {
      bookingCode: dto.bookingCode,
      reservationNo: dto.bookingCode,
      status: dto.status ?? 'CONFIRMED',
      type: dto.type ?? 'flight',
      memberId:
        memberIdOverride !== undefined
          ? memberIdOverride
          : this.safeMemberObjectId(memberId),
    };
    if (dto.flight !== undefined) doc.flight = dto.flight;
    if (dto.flightLegs !== undefined) doc.flightLegs = dto.flightLegs;
    if (dto.passengers !== undefined) doc.passengers = dto.passengers;
    if (dto.payment !== undefined) doc.payment = dto.payment;
    if (dto.shoppingFileId !== undefined) doc.shoppingFileId = dto.shoppingFileId;
    if (dto.totalFare !== undefined) doc.totalFare = dto.totalFare;
    if (dto.currency !== undefined) doc.currency = dto.currency;
    if (dto.correlationId !== undefined) doc.correlationId = dto.correlationId;
    if (dto.failureReason !== undefined) doc.failureReason = dto.failureReason;
    return doc;
  }

  private async updateByBookingCode(
    dto: CreateReservationDto,
    memberId: string | undefined,
    existing: Reservation,
  ): Promise<Reservation> {
    const nextStatus = dto.status ?? existing.status ?? 'CONFIRMED';
    const $set: Record<string, unknown> = {
      bookingCode: dto.bookingCode,
      reservationNo: dto.bookingCode,
      status: nextStatus,
      type: dto.type ?? existing.type ?? 'flight',
    };
    if (memberId) {
      $set.memberId = this.safeMemberObjectId(memberId);
    }
    if (dto.flight !== undefined) $set.flight = dto.flight;
    if (dto.flightLegs !== undefined) $set.flightLegs = dto.flightLegs;
    if (dto.passengers !== undefined) $set.passengers = dto.passengers;
    const mergedPay = this.mergePayment(existing.payment, dto.payment);
    if (mergedPay !== undefined) $set.payment = mergedPay;
    if (dto.shoppingFileId !== undefined) $set.shoppingFileId = dto.shoppingFileId;
    if (dto.totalFare !== undefined) $set.totalFare = dto.totalFare;
    if (dto.currency !== undefined) $set.currency = dto.currency;
    if (dto.correlationId !== undefined) $set.correlationId = dto.correlationId;
    if (dto.failureReason !== undefined) $set.failureReason = dto.failureReason;
    if (nextStatus === 'CONFIRMED') {
      $set.failureReason = null;
    }

    const runValidators = nextStatus === 'CONFIRMED';

    const saved = await this.reservationModel
      .findOneAndUpdate({ bookingCode: dto.bookingCode }, { $set }, { new: true, runValidators })
      .exec();
    if (!saved) {
      throw new Error(`Rezervasyon güncellenemedi: ${dto.bookingCode}`);
    }
    this.logger.log(
      `Rezervasyon güncellendi (aynı bookingCode): ${saved.bookingCode} | status: ${saved.status}`,
    );
    return saved;
  }

  async findByMember(memberId: string): Promise<Reservation[]> {
    return this.reservationModel
      .find({ memberId: new Types.ObjectId(memberId) })
      .sort({ createdAt: -1 })
      .lean()
      .exec() as unknown as Reservation[];
  }

  async findByBookingCode(bookingCode: string): Promise<Reservation | null> {
    return this.reservationModel.findOne({ bookingCode }).exec();
  }

  /** Rezervasyon onay maili kuyruğa ekle */
  private async enqueueConfirmationEmail(
    saved: Reservation,
    dto: CreateReservationDto,
  ): Promise<void> {
    const contactEmail = dto.contactEmail?.trim();
    if (!contactEmail) return;

    try {
      await this.confirmationQueue.add(
        'send-confirmation',
        {
          contactEmail,
          contactName: dto.contactName?.trim() || saved.passengers?.[0]?.firstName || 'Yolcu',
          bookingCode: saved.bookingCode,
          totalFare: saved.totalFare,
          currency: saved.currency || 'TRY',
          passengers: (saved.passengers || []).map((p: any) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            type: p.type,
          })),
          flight: saved.flight,
          flightLegs: saved.flightLegs,
          payment: {
            cardHolder: (saved.payment as any)?.cardHolder,
            cardNumber: (saved.payment as any)?.cardNumber,
            bankName: (saved.payment as any)?.bankName,
            installmentCount: (saved.payment as any)?.installmentCount,
            finalizedDate: (saved.payment as any)?.finalizedDate,
          },
        },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
      this.logger.log(`Rezervasyon onay maili kuyruğa eklendi: ${saved.bookingCode} → ${contactEmail}`);
    } catch (err) {
      this.logger.error(`Onay maili kuyruğa eklenemedi: ${saved.bookingCode}`, err);
    }
  }
}
