import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './schemas/blog.schema';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private readonly blogModel: Model<Blog>) {}

  async findAll(page = 1, limit = 20, search?: string, status?: string) {
    const p = Math.max(1, +page);
    const l = Math.min(100, Math.max(1, +limit));
    const filter: any = {};
    if (status) filter.status = status;
    if (search?.trim()) {
      const r = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: r }, { category: r }, { tags: r }];
    }
    const [data, total] = await Promise.all([
      this.blogModel.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).lean(),
      this.blogModel.countDocuments(filter),
    ]);
    return { data, total, page: p, limit: l };
  }

  async findOne(id: string) {
    const blog = await this.blogModel.findById(id).lean();
    if (!blog) throw new NotFoundException('Blog yazısı bulunamadı');
    return blog;
  }

  async create(dto: any) {
    const base = slugify(dto.title);
    let slug = base;
    let i = 1;
    while (await this.blogModel.exists({ slug })) slug = `${base}-${i++}`;
    const blog = new this.blogModel({
      ...dto,
      slug,
      publishedAt: dto.status === 'published' ? new Date() : null,
    });
    return blog.save();
  }

  async update(id: string, dto: any) {
    const blog = await this.blogModel.findById(id);
    if (!blog) throw new NotFoundException('Blog yazısı bulunamadı');
    if (dto.title && dto.title !== blog.title) {
      const base = slugify(dto.title);
      let slug = base; let i = 1;
      while (await this.blogModel.exists({ slug, _id: { $ne: id } })) slug = `${base}-${i++}`;
      dto.slug = slug;
    }
    if (dto.status === 'published' && !blog.publishedAt) dto.publishedAt = new Date();
    Object.assign(blog, dto);
    return blog.save();
  }

  async remove(id: string) {
    const blog = await this.blogModel.findByIdAndDelete(id);
    if (!blog) throw new NotFoundException('Blog yazısı bulunamadı');
    return { success: true };
  }
}
