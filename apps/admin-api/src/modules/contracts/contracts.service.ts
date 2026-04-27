import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract } from './schemas/contract.schema';

/** Başlıktan slug üretir (Türkçe karakterler dönüştürülür, boşluklar tire) */
function slugify(title: string): string {
    const tr: Record<string, string> = {
        ı: 'i', İ: 'i', ğ: 'g', Ğ: 'g', ü: 'u', Ü: 'u',
        ş: 's', Ş: 's', ö: 'o', Ö: 'o', ç: 'c', Ç: 'c',
    };
    let s = (title || '').trim();
    Object.keys(tr).forEach((key) => {
        s = s.split(key).join(tr[key]);
    });
    s = s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return s || 'contract';
}

@Injectable()
export class ContractsService {
    constructor(@InjectModel(Contract.name) private contractModel: Model<Contract>) {}

    async findAll(): Promise<Contract[]> {
        return this.contractModel.find().sort({ order: 1, title: 1 }).lean().exec();
    }

    async findById(id: string) {
        return this.contractModel.findById(id).lean().exec();
    }

    async findBySlug(slug: string) {
        return this.contractModel.findOne({ slug: (slug || '').trim().toLowerCase() }).lean().exec();
    }

    async create(data: { title: string; content?: string }) {
        const title = (data.title || '').trim();
        if (!title) throw new Error('Başlık zorunludur.');
        let slug = slugify(title);
        let exists = await this.contractModel.findOne({ slug }).exec();
        let n = 1;
        while (exists) {
            slug = `${slugify(title)}-${n}`;
            exists = await this.contractModel.findOne({ slug }).exec();
            n++;
        }
        const order = (await this.contractModel.countDocuments()) + 1;
        const doc = new this.contractModel({
            slug,
            title,
            content: (data.content || '').trim(),
            order,
            active: true,
        });
        return doc.save();
    }

    async update(id: string, data: { title?: string; content?: string }) {
        const update: Partial<Contract> = {};
        if (data.title !== undefined) update.title = (data.title || '').trim();
        if (data.content !== undefined) update.content = (data.content || '').trim();
        return this.contractModel
            .findByIdAndUpdate(id, update, { new: true })
            .lean()
            .exec();
    }
}
