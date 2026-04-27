import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'contracts' })
export class Contract extends Document {
    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    slug: string;

    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ default: '' })
    content: string;

    @Prop({ default: 0 })
    order: number;

    @Prop({ default: true })
    active: boolean;

    @Prop({ type: Types.ObjectId })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId })
    updatedBy: Types.ObjectId;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
