import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'member_refresh_tokens' })
export class MemberRefreshToken extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Member', required: true, index: true })
  memberId: Types.ObjectId;

  @Prop({ required: true, index: true })
  tokenHash: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ default: false })
  revoked: boolean;

  @Prop({ type: String, default: null })
  revokedReason: string | null;
}

export const MemberRefreshTokenSchema = SchemaFactory.createForClass(MemberRefreshToken);

// Süresi dolmuş token'ları otomatik sil (TTL index)
MemberRefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Aynı kullanıcının çok fazla token biriktirmesini önlemek için
MemberRefreshTokenSchema.index({ memberId: 1, revoked: 1 });
