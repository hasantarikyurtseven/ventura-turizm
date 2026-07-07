import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'saved_passengers' })
export class SavedPassenger extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Member', index: true })
  memberId: Types.ObjectId;

  /** Kullanıcının verdiği kısa isim: "Anne", "Çocuğum" vb. */
  @Prop({ trim: true, default: '' })
  label: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  /** YYYY-MM-DD */
  @Prop({ required: true })
  birthDate: string;

  /** 'M' | 'F' */
  @Prop({ required: true, enum: ['M', 'F'] })
  gender: string;

  /** ISO-3166-1 alpha-2: 'TR', 'DE' vb. */
  @Prop({ required: true, uppercase: true, trim: true })
  nationality: string;

  /** 'ADT' | 'CHD' | 'INF' */
  @Prop({ required: true, enum: ['ADT', 'CHD', 'INF'], default: 'ADT' })
  paxType: string;

  @Prop({ trim: true, default: '' })
  tcNo: string;

  @Prop({ trim: true, default: '' })
  passportNumber: string;

  /** YYYY-MM-DD */
  @Prop({ default: '' })
  passportExpiry: string;

  @Prop({ trim: true, default: '' })
  email: string;

  @Prop({ trim: true, default: '' })
  phone: string;
}

export const SavedPassengerSchema = SchemaFactory.createForClass(SavedPassenger);
SavedPassengerSchema.index({ memberId: 1, createdAt: -1 });
