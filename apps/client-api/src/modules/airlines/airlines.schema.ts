import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'airlines' })
export class Airline extends Document {
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  logoUrl: string;

  @Prop({ default: 'active', enum: ['active', 'passive'] })
  status: string;
}

export const AirlineSchema = SchemaFactory.createForClass(Airline);
