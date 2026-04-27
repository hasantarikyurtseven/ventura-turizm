import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class Passenger {
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop() birthDate: string;
  @Prop() gender: string;
  @Prop() tcNo: string;
  @Prop() passportNo: string;
  @Prop() nationality: string;
}

@Schema({ _id: false })
export class FlightSegment {
  @Prop() airline: string;
  @Prop() flightNo: string;
  @Prop() origin: string;
  @Prop() destination: string;
  @Prop() departureAt: Date;
  @Prop() arrivalAt: Date;
  @Prop() cabinClass: string;
}

@Schema({ _id: false })
export class PaymentInfo {
  @Prop() method: string;
  @Prop() transactionId: string;
  @Prop() paidAt: Date;
  @Prop() amount: number;
  @Prop() currency: string;
}

@Schema({ timestamps: true, collection: 'reservations', strict: false })
export class Reservation extends Document {
  @Prop({ required: false })
  reservationNo: string;

  @Prop({ required: false, default: 'flight' })
  type: string;

  @Prop({ required: false, default: 'pending' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Member', required: false, default: null })
  memberId: Types.ObjectId | null;

  @Prop({ required: false }) memberFirstName: string;
  @Prop({ required: false }) memberLastName: string;
  @Prop({ required: false }) memberEmail: string;
  @Prop() memberPhone: string;

  @Prop({ type: [Passenger], default: [] })
  passengers: Passenger[];

  @Prop({ type: [FlightSegment], default: [] })
  segments: FlightSegment[];

  @Prop({ type: PaymentInfo, default: null })
  payment: PaymentInfo;

  @Prop({ required: false, default: 0 })
  totalAmount: number;

  @Prop({ default: 'TRY' })
  currency: string;

  @Prop({ type: Date, default: null })
  completedAt: Date | null;

  @Prop({ type: Date, default: null })
  cancelledAt: Date | null;

  @Prop()
  cancellationReason: string;

  @Prop()
  notes: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

ReservationSchema.index({ reservationNo: 1 }, { unique: true, sparse: true });
ReservationSchema.index({ bookingCode: 1 }, { unique: true, sparse: true });
ReservationSchema.index({ memberId: 1 });
ReservationSchema.index({ status: 1 });
ReservationSchema.index({ type: 1 });
ReservationSchema.index({ createdAt: -1 });
