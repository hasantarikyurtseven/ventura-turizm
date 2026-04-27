import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminNotificationDocument = AdminNotification & Document;

@Schema({ timestamps: true, collection: 'admin_notifications' })
export class AdminNotification {
    @Prop({ required: true })
    kind: string;

    @Prop({ required: true })
    message: string;

    @Prop({ default: 'confirmation_number' })
    icon: string;

    @Prop({ default: false })
    read: boolean;

    @Prop({ type: String, default: null })
    bookingCode: string | null;

    @Prop({ type: String, default: null })
    reservationId: string | null;
}

export const AdminNotificationSchema = SchemaFactory.createForClass(AdminNotification);

AdminNotificationSchema.index({ createdAt: -1 });
AdminNotificationSchema.index({ read: 1, createdAt: -1 });
