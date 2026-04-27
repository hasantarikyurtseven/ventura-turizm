import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailVerificationProcessor } from './email-verification.processor';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-verification',
    }),
    EmailModule,
  ],
  providers: [EmailVerificationProcessor],
})
export class EmailVerificationModule {}
