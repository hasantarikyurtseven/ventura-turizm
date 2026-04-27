import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'permissions' })
export class Permission extends Document {
    @Prop({ required: true, unique: true })
    code: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ type: [String], default: [] })
    modules: string[];

    @Prop({ default: 'active', enum: ['active', 'passive'] })
    status: string;

    @Prop({ type: Types.ObjectId })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId })
    updatedBy: Types.ObjectId;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
