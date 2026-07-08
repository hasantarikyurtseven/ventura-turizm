import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailModule } from '../email/email.module';
import { ContactFormProcessor } from './contact-form.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'contact-form' }),
    EmailModule,
  ],
  providers: [ContactFormProcessor],
})
export class ContactFormModule {}
