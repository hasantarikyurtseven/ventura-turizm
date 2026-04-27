import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Airline } from './airlines.schema';

@Injectable()
export class AirlinesService {
  constructor(@InjectModel(Airline.name) private airlineModel: Model<Airline>) {}

  async findAll(): Promise<{ code: string; name: string; logoUrl?: string }[]> {
    const list = await this.airlineModel
      .find({ status: 'active' })
      .select('code name logoUrl')
      .sort({ code: 1 })
      .lean()
      .exec();
    return list.map((d: any) => ({
      code: d.code,
      name: d.name,
      logoUrl: d.logoUrl || undefined,
    }));
  }

  async findByCode(code: string): Promise<{ code: string; name: string; logoUrl?: string } | null> {
    const d = await this.airlineModel
      .findOne({ code: (code || '').trim().toUpperCase(), status: 'active' })
      .select('code name logoUrl')
      .lean()
      .exec();
    if (!d) return null;
    return { code: d.code, name: d.name, logoUrl: d.logoUrl };
  }
}
