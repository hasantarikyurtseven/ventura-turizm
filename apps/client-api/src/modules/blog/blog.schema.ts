import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'blogs', strict: false })
export class Blog extends Document {
  @Prop() title: string;
  @Prop() slug: string;
  @Prop() excerpt: string;
  @Prop() content: string;
  @Prop() coverImage: string;
  @Prop() category: string;
  @Prop({ type: [String] }) tags: string[];
  @Prop() status: string;
  @Prop() author: string;
  @Prop() publishedAt: Date;
  @Prop() viewCount: number;
  @Prop() metaTitle: string;
  @Prop() metaDescription: string;
  @Prop() createdAt: Date;
  @Prop() updatedAt: Date;
}
export const BlogSchema = SchemaFactory.createForClass(Blog);
