import { Module } from '@nestjs/common';
import { BiletbankAuthModule } from '../../auth/auth.module';
import { BiletbankMakePrebookingController } from './makeprebooking.controller';
import { BiletbankMakePrebookingService } from './makeprebooking.service';

@Module({
  imports: [BiletbankAuthModule],
  controllers: [BiletbankMakePrebookingController],
  providers: [BiletbankMakePrebookingService],
  exports: [BiletbankMakePrebookingService],
})
export class BiletbankMakePrebookingModule {}
