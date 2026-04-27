import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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

    @Prop({ type: Types.ObjectId })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId })
    updatedBy: Types.ObjectId;
}

export const AirlineSchema = SchemaFactory.createForClass(Airline);
