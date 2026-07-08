import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Faq, ContactMessage } from './help.schema';

@Injectable()
export class HelpService {
  constructor(
    @InjectModel(Faq.name) private readonly faqModel: Model<Faq>,
    @InjectModel(ContactMessage.name) private readonly msgModel: Model<ContactMessage>,
    @InjectQueue('contact-form') private readonly contactQueue: Queue,
  ) {}

  async getFaqs() {
    return this.faqModel.find({ active: true }).sort({ category: 1, order: 1 }).lean();
  }

  async submitContact(dto: { name: string; email: string; phone?: string; subject: string; message: string }) {
    // DB'ye kaydet
    await new this.msgModel({ ...dto, status: 'new' }).save();
    // E-posta kuyruğuna gönder
    await this.contactQueue.add('send-contact-email', dto, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });
    return { success: true };
  }
}
