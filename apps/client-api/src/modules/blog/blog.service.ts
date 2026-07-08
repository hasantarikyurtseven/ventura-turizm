import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './blog.schema';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private readonly blogModel: Model<Blog>) {}

  async findAll(page = 1, limit = 10, category?: string) {
    const p = Math.max(1, +page);
    const l = Math.min(50, Math.max(1, +limit));
    const filter: any = { status: 'published' };
    if (category) filter.category = category;
    const [data, total] = await Promise.all([
      this.blogModel.find(filter, { content: 0 })
        .sort({ publishedAt: -1 }).skip((p - 1) * l).limit(l).lean(),
      this.blogModel.countDocuments(filter),
    ]);
    return { data, total, page: p, limit: l };
  }

  async findBySlug(slug: string) {
    const blog = await this.blogModel.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { viewCount: 1 } },
      { new: true },
    ).lean();
    return blog;
  }

  async getCategories() {
    return this.blogModel.distinct('category', { status: 'published' });
  }
}
