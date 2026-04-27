import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract } from './contracts.schema';

@Injectable()
export class ContractsService {
  constructor(@InjectModel(Contract.name) private contractModel: Model<Contract>) {}

  async findAll(): Promise<{ slug: string; title: string }[]> {
    const list = await this.contractModel
      .find({ active: true })
      .select('slug title')
      .sort({ order: 1, title: 1 })
      .lean()
      .exec();
    return list.map((d: any) => ({ slug: d.slug, title: d.title }));
  }

  async findBySlug(slug: string): Promise<{ slug: string; title: string; content: string } | null> {
    const d = await this.contractModel
      .findOne({ slug: (slug || '').trim().toLowerCase(), active: true })
      .select('slug title content')
      .lean()
      .exec();
    if (!d) return null;
    return {
      slug: d.slug,
      title: d.title,
      content: d.content || '',
    };
  }
}
