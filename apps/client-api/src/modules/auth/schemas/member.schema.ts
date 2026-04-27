import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class ContractAcceptance {
  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  acceptedAt: Date;

  @Prop({ required: true })
  ipAddress: string;
}

@Schema({ timestamps: true, collection: 'members' })
export class Member extends Document {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ type: String, default: null })
  verificationToken: string | null;

  @Prop({ type: Date, default: null })
  verificationTokenExpiresAt: Date | null;

  @Prop({ default: 'pending', enum: ['pending', 'active', 'suspended'] })
  status: string;

  @Prop({ type: [ContractAcceptance], default: [] })
  contractAcceptances: ContractAcceptance[];

  @Prop({ default: false })
  marketingConsent: boolean;

  @Prop({ type: Date, default: null })
  lastLoginAt: Date | null;

  @Prop({ type: String, default: null })
  lastLoginIp: string | null;
}

export const MemberSchema = SchemaFactory.createForClass(Member);

// Index'ler
MemberSchema.index({ email: 1 }, { unique: true });
MemberSchema.index({ verificationToken: 1 }, { sparse: true });
