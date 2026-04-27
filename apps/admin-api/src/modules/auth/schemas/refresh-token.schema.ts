import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'refresh_tokens' })
export class RefreshToken extends Document {
    @Prop({ required: true, default: 'admin' })
    ownerType: string;

    @Prop({ type: Types.ObjectId, required: true })
    ownerId: Types.ObjectId;

    @Prop({ required: true })
    tokenHash: string;

    @Prop({ required: true })
    expiresAt: Date;

    @Prop()
    revokedAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
