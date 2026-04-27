import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BiletbankConfigService } from '../common/biletbank.config';
import { BiletbankAuthService } from './auth.service';

@Module({
  imports: [ConfigModule],
  providers: [BiletbankConfigService, BiletbankAuthService],
  exports: [BiletbankConfigService, BiletbankAuthService],
})
export class BiletbankAuthModule {}

