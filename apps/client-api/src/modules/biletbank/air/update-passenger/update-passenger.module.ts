import { Module } from '@nestjs/common';
import { BiletbankAuthModule } from '../../auth/auth.module';
import { BiletbankUpdatePassengerController } from './update-passenger.controller';
import { BiletbankUpdatePassengerService } from './update-passenger.service';
import { BookingAuthGuard } from '../../guards/booking-auth.guard';

@Module({
  imports: [BiletbankAuthModule],
  controllers: [BiletbankUpdatePassengerController],
  providers: [BiletbankUpdatePassengerService, BookingAuthGuard],
  exports: [BiletbankUpdatePassengerService],
})
export class BiletbankUpdatePassengerModule {}
