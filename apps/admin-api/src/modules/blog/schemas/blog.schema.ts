import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'blogs' })
export class Blog extends Document {
  @Prop({ required: true, trim: true }) title: string;
  @Prop({ required: true, unique: true, trim: true, lowercase: true }) slug: string;
  @Prop({ default: '' }) excerpt: string;
  @Prop({ default: '' }) content: string;
  @Prop({ default: '' }) coverImage: string;
  @Prop({ default: '' }) category: string;
  @Prop({ type: [String], default: [] }) tags: string[];
  @Prop({ default: 'draft', enum: ['draft', 'published'] }) status: string;
  @Prop({ default: '' }) author: string;
  @Prop({ type: Date, default: null }) publishedAt: Date | null;
  @Prop({ default: 0 }) viewCount: number;
  // SEO
  @Prop({ default: '' }) metaTitle: string;
  @Prop({ default: '' }) metaDescription: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.index({ slug: 1 }, { unique: true });
BlogSchema.index({ status: 1, publishedAt: -1 });
