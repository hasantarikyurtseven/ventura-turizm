import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { Reservation, ReservationSchema } from './reservation.schema';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module';

/**
 * AuthModule @Global() olarak tanımlandığından burada import etmeye gerek yok.
 * JwtService ve ConfigService otomatik inject edilebilir.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reservation.name, schema: ReservationSchema }]),
    AdminNotificationsModule,
    BullModule.registerQueue({ name: 'reservation-confirmation' }),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
