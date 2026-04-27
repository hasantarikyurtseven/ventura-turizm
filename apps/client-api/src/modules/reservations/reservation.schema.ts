import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class ReservationPassenger {
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop({ required: true }) type: string; // ADT | CHD | INF
  /** Düz TCKN — RESERVATION_REDACT_PLAIN_CITIZEN=true iken yazılmayabilir */
  @Prop() citizenNo?: string;
  /** HMAC-SHA256 (CITIZEN_ID_STORAGE_PEPPER); arama/doğrulama için */
  @Prop() citizenNoSha256?: string;
  @Prop() passportNo?: string;
  @Prop() passportCountry?: string;
  @Prop() passportValidDate?: string;
  @Prop() birthDate?: string;
  @Prop() gender?: string;
  /** ISO ülke kodu (örn. TR, US) */
  @Prop() nationality?: string;
  /** TC | PASSPORT */
  @Prop() idType?: string;
  @Prop() email?: string;
  @Prop() phone?: string;
}
export const ReservationPassengerSchema = SchemaFactory.createForClass(ReservationPassenger);

@Schema({ _id: false })
export class ReservationFlightPoint {
  @Prop({ required: true }) airportCode: string;
  @Prop() airportName?: string;
  @Prop() airport?: string;
  @Prop() city?: string;
  @Prop({ required: true }) time: string;
  @Prop({ required: true }) date: string;
}
export const ReservationFlightPointSchema = SchemaFactory.createForClass(ReservationFlightPoint);

@Schema({ _id: false })
export class ReservationFlight {
  @Prop({ required: true }) airline: string;
  @Prop() airlineLogo?: string;
  @Prop({ required: true }) flightNumber: string;
  @Prop({ type: ReservationFlightPointSchema }) departure: ReservationFlightPoint;
  @Prop({ type: ReservationFlightPointSchema }) arrival: ReservationFlightPoint;
  @Prop() duration?: string;
  @Prop() cabinClass?: string;
  @Prop() brandName?: string;
  @Prop() baggageDescription?: string;
}
export const ReservationFlightSchema = SchemaFactory.createForClass(ReservationFlight);

@Schema({ _id: false })
export class ReservationPayment {
  @Prop() amount?: number;
  @Prop() currency?: string;
  @Prop() cardNumber?: string;
  @Prop() cardHolder?: string;
  @Prop() bankName?: string;
  @Prop() installmentCount?: number;
  @Prop() finalizedDate?: string;
  @Prop() paymentId?: string;
}
export const ReservationPaymentSchema = SchemaFactory.createForClass(ReservationPayment);

@Schema({ timestamps: true, collection: 'reservations' })
export class Reservation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Member', required: false, default: null })
  memberId: Types.ObjectId | null;

  /**
   * admin-api ile aynı koleksiyon; DB'de reservationNo üzerinde unique index var.
   * Alan yok veya null iken ikinci kayıt E11000 üretebiliyor — her zaman bookingCode ile doldurulur.
   */
  @Prop({ required: false })
  reservationNo?: string;

  @Prop({ required: true })
  bookingCode: string;

  @Prop({ required: true, default: 'CONFIRMED' })
  status: string; // CONFIRMED | CANCELLED | PENDING | PAYMENT_FAILED

  @Prop({ required: true, default: 'flight' })
  type: string; // flight | bus | hotel | car

  @Prop({ type: ReservationFlightSchema })
  flight?: ReservationFlight;

  @Prop({ type: [ReservationPassengerSchema], default: [] })
  passengers: ReservationPassenger[];

  @Prop({ type: ReservationPaymentSchema })
  payment?: ReservationPayment;

  @Prop() shoppingFileId?: string;
  @Prop() totalFare?: number;
  @Prop() currency?: string;
  @Prop() correlationId?: string;

  @Prop({ type: String, default: null })
  failureReason?: string | null;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
