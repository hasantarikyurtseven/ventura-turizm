import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'roles' })
export class Role extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Permission' }] })
    permissions: Types.ObjectId[];

    @Prop({ default: 'active', enum: ['active', 'passive'] })
    status: string;

    @Prop({ type: Types.ObjectId })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId })
    updatedBy: Types.ObjectId;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
