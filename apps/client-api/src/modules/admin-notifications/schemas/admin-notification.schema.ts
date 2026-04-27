import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Admin panel bildirimleri — admin-api ile aynı koleksiyon (admin_notifications).
 */
@Schema({ timestamps: true, collection: 'admin_notifications' })
export class AdminNotification extends Document {
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
