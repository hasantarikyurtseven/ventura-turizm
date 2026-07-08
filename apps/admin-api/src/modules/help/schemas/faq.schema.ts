import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'faqs' })
export class Faq extends Document {
  @Prop({ required: true }) question: string;
  @Prop({ required: true }) answer: string;
  @Prop({ default: 'Genel' }) category: string;
  @Prop({ default: 0 }) order: number;
  @Prop({ default: true }) active: boolean;
}
export const FaqSchema = SchemaFactory.createForClass(Faq);
