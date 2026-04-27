import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
class UserRole {
    @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
    roleId: Types.ObjectId;

    @Prop({ default: Date.now })
    assignedAt: Date;

    @Prop({ type: Types.ObjectId, required: false })
    assignedBy?: Types.ObjectId;
}

@Schema({ timestamps: true, collection: 'users' })
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    surName: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    phone: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ default: 'active', enum: ['active', 'passive'] })
    status: string;

    @Prop({ type: [UserRole], default: [] })
    roles: UserRole[];

    @Prop({ type: Types.ObjectId })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId })
    updatedBy: Types.ObjectId;

    @Prop()
    lastLoginAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
