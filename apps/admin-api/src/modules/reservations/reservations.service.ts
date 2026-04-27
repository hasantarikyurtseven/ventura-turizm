import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reservation } from './schemas/reservation.schema';
import { Member } from '../members/schemas/member.schema';
import {
  normalizeReservationDoc,
  statusFilterValues,
} from './reservation-normalizer';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<Reservation>,
    @InjectModel(Member.name) private memberModel: Model<Member>,
  ) {}

  private async normalizeMany(documents: any[]): Promise<any[]> {
    const ids = new Set<string>();
    for (const d of documents) {
      if (d?.memberId) ids.add(String(d.memberId));
    }
    const idList = [...ids]
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));
    const members =
      idList.length > 0
        ? await this.memberModel
            .find({ _id: { $in: idList } })
            .select('firstName lastName email phone')
            .lean()
            .exec()
        : [];
    const membersById = new Map(
      members.map((m: any) => [String(m._id), m]),
    );
    return documents.map((doc) =>
      normalizeReservationDoc(
        doc,
        doc?.memberId ? membersById.get(String(doc.memberId)) || null : null,
      ),
    );
  }

  private async normalizeOne(doc: any): Promise<any> {
    const m = doc?.memberId
      ? await this.memberModel
          .findById(doc.memberId)
          .select('firstName lastName email phone')
          .lean()
          .exec()
      : null;
    return normalizeReservationDoc(doc, m);
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    status?: string,
    type?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<{ data: any[]; total: number }> {
    const filter: any = {};

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { reservationNo: regex },
        { bookingCode: regex },
        { memberFirstName: regex },
        { memberLastName: regex },
        { memberEmail: regex },
        { 'passengers.firstName': regex },
        { 'passengers.lastName': regex },
      ];
    }
    if (status) {
      filter.status = { $in: statusFilterValues(status) };
    }
    if (type) {
      if (type === 'car_rental') {
        filter.type = { $in: ['car_rental', 'car'] };
      } else {
        filter.type = type;
      }
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const [raw, total] = await Promise.all([
      this.reservationModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.reservationModel.countDocuments(filter).exec(),
    ]);

    const data = await this.normalizeMany(raw);
    return { data, total };
  }

  async findOne(id: string): Promise<any> {
    const reservation = await this.reservationModel.findById(id).lean().exec();
    if (!reservation) throw new NotFoundException('Rezervasyon bulunamadı');
    return this.normalizeOne(reservation);
  }

  async getStats(): Promise<any> {
    /** Uçuş akışında başarı = CONFIRMED veya COMPLETED; ayrı kartlarda çift anlam önlenir */
    const approvedStatuses = [
      ...statusFilterValues('confirmed'),
      ...statusFilterValues('completed'),
    ];

    const [total, pending, approved, cancelled, paymentFailed] =
      await Promise.all([
        this.reservationModel.countDocuments().exec(),
        this.reservationModel.countDocuments({
          status: { $in: statusFilterValues('pending') },
        }).exec(),
        this.reservationModel
          .countDocuments({
            status: { $in: approvedStatuses },
          })
          .exec(),
        this.reservationModel.countDocuments({
          status: { $in: statusFilterValues('cancelled') },
        }).exec(),
        this.reservationModel.countDocuments({
          status: { $in: statusFilterValues('payment_failed') },
        }).exec(),
      ]);

    const revenueAgg = await this.reservationModel.aggregate([
      {
        $match: {
          status: {
            $in: approvedStatuses,
          },
        },
      },
      {
        $project: {
          amt: {
            $ifNull: [
              '$totalAmount',
              { $ifNull: ['$totalFare', { $ifNull: ['$payment.amount', 0] }] },
            ],
          },
        },
      },
      { $group: { _id: null, total: { $sum: '$amt' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total ?? 0;

    return {
      total,
      pending,
      approved,
      cancelled,
      paymentFailed,
      totalRevenue,
    };
  }

  async updateStatus(id: string, status: string, reason?: string): Promise<any> {
    const update: any = { status };
    if (status === 'completed') update.completedAt = new Date();
    if (status === 'cancelled') {
      update.cancelledAt = new Date();
      if (reason) update.cancellationReason = reason;
    }
    const reservation = await this.reservationModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean()
      .exec();
    if (!reservation) throw new NotFoundException('Rezervasyon bulunamadı');
    return this.normalizeOne(reservation);
  }

  async create(dto: Partial<Reservation>): Promise<Reservation> {
    const reservation = new this.reservationModel(dto);
    return reservation.save();
  }

  /** Kontrol paneli: son kayıtlar (normalize edilmiş) */
  async findRecent(limit = 8): Promise<any[]> {
    const safe = Math.min(Math.max(Number(limit) || 8, 1), 50);
    const raw = await this.reservationModel
      .find()
      .sort({ createdAt: -1 })
      .limit(safe)
      .lean()
      .exec();
    return this.normalizeMany(raw);
  }
}
