import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailModule } from '../email/email.module';
import { ReservationConfirmationProcessor } from './reservation-confirmation.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'reservation-confirmation' }),
    EmailModule,
  ],
  providers: [ReservationConfirmationProcessor],
})
export class ReservationConfirmationModule {}
