import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * client-api'deki airports koleksiyonu ile aynı yapı.
 * Admin tarafında ülke listesini distinct olarak çıkarmak için
 * aynı koleksiyona okuma yapıyoruz.
 */
@Schema({ collection: 'airports', timestamps: true })
export class Airport extends Document {
  @Prop({ required: true })
  cityCode!: string;

  @Prop({ required: true })
  cityName!: string;

  @Prop({ required: true })
  airportCode!: string;

  @Prop({ required: true })
  airportName!: string;

  @Prop({ required: true })
  countryCode!: string;

  @Prop({ required: true })
  countryName!: string;

  @Prop()
  timeZoneId?: string;

  @Prop()
  rating?: string;

  @Prop()
  searchName?: string;
}

export const AirportSchema = SchemaFactory.createForClass(Airport);
