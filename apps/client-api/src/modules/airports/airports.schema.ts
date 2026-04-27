import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'airports', timestamps: true })
export class Airport extends Document {
  @Prop({ required: true })
  cityCode!: string; // IATA city code (IST, BER, ...)

  @Prop({ required: true })
  cityName!: string;

  @Prop({ required: true })
  airportCode!: string; // IATA airport code (IST, SAW, ...)

  @Prop({ required: true })
  airportName!: string;

  @Prop({ required: true })
  countryCode!: string; // ISO country code (TR, DE, ...)

  @Prop({ required: true })
  countryName!: string;

  @Prop()
  timeZoneId?: string;

  @Prop()
  rating?: string;

  @Prop()
  searchName?: string; // UI araması için hazır string
}

export const AirportSchema = SchemaFactory.createForClass(Airport);

