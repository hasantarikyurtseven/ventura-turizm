import { Module } from '@nestjs/common';
import { BiletbankAuthModule } from '../../auth/auth.module';
import { AuthModule } from '../../../auth/auth.module';
import { BiletbankAllocateController } from './allocate.controller';
import { BiletbankAllocateService } from './allocate.service';
import { BookingAuthGuard } from '../../guards/booking-auth.guard';

@Module({
  imports: [BiletbankAuthModule, AuthModule],
  controllers: [BiletbankAllocateController],
  providers: [BiletbankAllocateService, BookingAuthGuard],
  exports: [BiletbankAllocateService],
})
export class BiletbankAllocateModule {}
