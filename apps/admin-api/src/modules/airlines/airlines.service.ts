import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Airline } from './schemas/airline.schema';

@Injectable()
export class AirlinesService {
    constructor(@InjectModel(Airline.name) private airlineModel: Model<Airline>) {}

    async findAll(page = 1, limit = 50, search?: string): Promise<{ data: Airline[]; total: number }> {
        const skip = (Math.max(1, page) - 1) * Math.min(100, Math.max(1, limit));
        const l = Math.min(100, Math.max(1, limit));
        const query: any = {};
        if (search && search.trim()) {
            const s = search.trim();
            query.$or = [
                { code: new RegExp(s, 'i') },
                { name: new RegExp(s, 'i') },
            ];
        }
        const [data, total] = await Promise.all([
            this.airlineModel.find(query).sort({ code: 1 }).skip(skip).limit(l).lean().exec(),
            this.airlineModel.countDocuments(query),
        ]);
        return { data: data as Airline[], total };
    }

    async findById(id: string) {
        return this.airlineModel.findById(id).lean().exec();
    }

    async findByCode(code: string) {
        return this.airlineModel.findOne({ code: code?.trim().toUpperCase() }).lean().exec();
    }

    async create(data: Partial<Airline>) {
        const code = (data.code || '').trim().toUpperCase();
        const existing = await this.airlineModel.findOne({ code }).exec();
        if (existing) {
            throw new Error('Bu havayolu kodu zaten kayıtlı.');
        }
        const doc = new this.airlineModel({ ...data, code });
        return doc.save();
    }

    async update(id: string, data: Partial<Airline>) {
        if (data.code) data.code = (data.code as string).trim().toUpperCase();
        return this.airlineModel
            .findByIdAndUpdate(id, data, { new: true })
            .lean()
            .exec();
    }

    async delete(id: string) {
        await this.airlineModel.findByIdAndDelete(id).exec();
    }
}
