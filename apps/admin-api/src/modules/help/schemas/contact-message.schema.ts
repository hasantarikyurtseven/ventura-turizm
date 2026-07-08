import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'contact_messages' })
export class ContactMessage extends Document {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) email: string;
  @Prop({ default: '' }) phone: string;
  @Prop({ required: true }) subject: string;
  @Prop({ required: true }) message: string;
  @Prop({ default: 'new', enum: ['new', 'read', 'replied'] }) status: string;
  @Prop({ default: '' }) adminNote: string;
}
export const ContactMessageSchema = SchemaFactory.createForClass(ContactMessage);
