import { Module } from '@nestjs/common';
import { BiletbankAuthModule } from '../../auth/auth.module';
import { AuthModule } from '../../../auth/auth.module';
import { BiletbankAirSearchController } from './airsearch.controller';
import { BiletbankAirSearchService } from './airsearch.service';
import { BookingAuthGuard } from '../../guards/booking-auth.guard';

@Module({
  imports: [BiletbankAuthModule, AuthModule],
  controllers: [BiletbankAirSearchController],
  providers: [BiletbankAirSearchService, BookingAuthGuard],
})
export class BiletbankAirSearchModule {}

