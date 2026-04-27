import { Module } from '@nestjs/common';
import { BiletbankController } from './biletbank.controller';
import { BiletbankAuthModule } from './auth/auth.module';
import { BiletbankAirSearchModule } from './air/airsearch/airsearch.module';
import { BiletbankAllocateModule } from './air/allocate/allocate.module';
import { BiletbankUpdatePassengerModule } from './air/update-passenger/update-passenger.module';
import { BiletbankMakePrebookingModule } from './air/makeprebooking/makeprebooking.module';
import { BiletbankMakePaymentModule } from './air/makepayment/makepayment.module';

@Module({
  imports: [
    BiletbankAuthModule,
    BiletbankAirSearchModule,
    BiletbankAllocateModule,
    BiletbankUpdatePassengerModule,
    BiletbankMakePrebookingModule,
    BiletbankMakePaymentModule,
  ],
  controllers: [BiletbankController],
})
export class BiletbankModule {}
