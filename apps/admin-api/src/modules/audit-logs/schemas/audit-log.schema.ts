import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'audit_logs' })
export class AuditLog extends Document {
    @Prop({ required: true, default: 'admin' })
    actorType: string;

    @Prop({ type: Types.ObjectId, required: false })
    actorId: Types.ObjectId;

    @Prop({ required: true })
    action: string;

    @Prop({ required: true })
    entityType: string;

    @Prop({ type: Types.ObjectId })
    entityId: Types.ObjectId;

    @Prop({ required: true })
    message: string;

    @Prop({ type: Object })
    metadata: any;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
