import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { Faq, FaqSchema, ContactMessage, ContactMessageSchema } from './help.schema';
import { HelpService } from './help.service';
import { HelpController } from './help.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Faq.name, schema: FaqSchema },
      { name: ContactMessage.name, schema: ContactMessageSchema },
    ]),
    BullModule.registerQueue({ name: 'contact-form' }),
  ],
  controllers: [HelpController],
  providers: [HelpService],
})
export class HelpModule {}
