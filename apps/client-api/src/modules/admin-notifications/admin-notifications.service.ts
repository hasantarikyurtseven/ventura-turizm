import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminNotification } from './schemas/admin-notification.schema';

@Injectable()
export class AdminNotificationsService {
  private readonly logger = new Logger(AdminNotificationsService.name);

  constructor(
    @InjectModel(AdminNotification.name)
    private readonly model: Model<AdminNotification>,
  ) {}

  /**
   * Yeni rezervasyon sonrası admin panelinde görünecek kayıt (MongoDB paylaşımlı).
   * Rezervasyon akışını bozmamak için hatalar yutulur ve loglanır.
   */
  async recordNewReservation(params: {
    bookingCode: string;
    reservationId: string;
  }): Promise<void> {
    try {
      await this.model.create({
        kind: 'new_reservation',
        message: `Yeni rezervasyon oluşturuldu: ${params.bookingCode}`,
        icon: 'confirmation_number',
        read: false,
        bookingCode: params.bookingCode,
        reservationId: params.reservationId,
      });
    } catch (err) {
      this.logger.warn(
        `Admin bildirimi yazılamadı (rezervasyon yine de kayıtlı): ${params.bookingCode}`,
        err instanceof Error ? err.stack : err,
      );
    }
  }
}
