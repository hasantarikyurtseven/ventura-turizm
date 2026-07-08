import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Faq } from './schemas/faq.schema';
import { ContactMessage } from './schemas/contact-message.schema';

@Injectable()
export class HelpService {
  constructor(
    @InjectModel(Faq.name) private readonly faqModel: Model<Faq>,
    @InjectModel(ContactMessage.name) private readonly msgModel: Model<ContactMessage>,
  ) {}

  // --- FAQ ---
  async findAllFaqs() {
    return this.faqModel.find().sort({ category: 1, order: 1 }).lean();
  }

  async createFaq(dto: any) {
    return new this.faqModel(dto).save();
  }

  async updateFaq(id: string, dto: any) {
    const faq = await this.faqModel.findByIdAndUpdate(id, dto, { new: true });
    if (!faq) throw new NotFoundException('FAQ bulunamadı');
    return faq;
  }

  async removeFaq(id: string) {
    await this.faqModel.findByIdAndDelete(id);
    return { success: true };
  }

  // --- Contact Messages ---
  async findAllMessages(page = 1, limit = 20, status?: string) {
    const p = Math.max(1, +page);
    const l = Math.min(100, +limit || 20);
    const filter: any = {};
    if (status) filter.status = status;
    const [data, total] = await Promise.all([
      this.msgModel.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).lean(),
      this.msgModel.countDocuments(filter),
    ]);
    return { data, total, page: p, limit: l };
  }

  async updateMessageStatus(id: string, status: string, adminNote?: string) {
    const msg = await this.msgModel.findByIdAndUpdate(
      id,
      { status, ...(adminNote !== undefined ? { adminNote } : {}) },
      { new: true },
    );
    if (!msg) throw new NotFoundException('Mesaj bulunamadı');
    return msg;
  }

  async getMessageStats() {
    const [total, newCount, read, replied] = await Promise.all([
      this.msgModel.countDocuments(),
      this.msgModel.countDocuments({ status: 'new' }),
      this.msgModel.countDocuments({ status: 'read' }),
      this.msgModel.countDocuments({ status: 'replied' }),
    ]);
    return { total, new: newCount, read, replied };
  }

  // Called from client-api (via direct DB) or via job queue
  async saveContactMessage(dto: any) {
    return new this.msgModel(dto).save();
  }
}
