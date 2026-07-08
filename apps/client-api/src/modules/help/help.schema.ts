import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'faqs', strict: false })
export class Faq extends Document {
  @Prop() question: string;
  @Prop() answer: string;
  @Prop() category: string;
  @Prop() order: number;
  @Prop() active: boolean;
}
export const FaqSchema = SchemaFactory.createForClass(Faq);

@Schema({ collection: 'contact_messages', strict: false })
export class ContactMessage extends Document {
  @Prop() name: string;
  @Prop() email: string;
  @Prop() phone: string;
  @Prop() subject: string;
  @Prop() message: string;
  @Prop() status: string;
}
export const ContactMessageSchema = SchemaFactory.createForClass(ContactMessage);
