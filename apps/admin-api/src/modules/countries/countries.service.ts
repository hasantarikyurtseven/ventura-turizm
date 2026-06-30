import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Airport } from './schemas/airport.schema';

export interface CountryListItem {
  countryCode: string;
  countryName: string;
  airportCount: number;
  cityCount: number;
}

export interface CountryAirportItem {
  airportCode: string;
  airportName: string;
  cityCode: string;
  cityName: string;
}

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Airport.name) private readonly airportModel: Model<Airport>,
  ) {}

  /**
   * airports koleksiyonundan ülkeleri distinct olarak getirir.
   * Her satırda: ülke kodu, ülke adı, havalimanı sayısı, şehir sayısı.
   *
   * NOT: Mongo'daki gerçek alan adları PascalCase (CountryCode, CountryName,
   * CityCode, AirportCode...) — Excel import'undan kaynaklanıyor.
   * Bu yüzden tüm $-prefix referansları PascalCase.
   */
  async findAll(
    page = 1,
    limit = 50,
    search?: string,
  ): Promise<{ data: CountryListItem[]; total: number }> {
    const p = Math.max(1, +page || 1);
    const l = Math.min(200, Math.max(1, +limit || 50));
    const skip = (p - 1) * l;

    const match: Record<string, unknown> = {};
    if (search && search.trim()) {
      const s = search.trim();
      match.$or = [
        { CountryCode: new RegExp(s, 'i') },
        { CountryName: new RegExp(s, 'i') },
      ];
    }

    const [data, totalResult] = await Promise.all([
      this.airportModel
        .aggregate<CountryListItem>([
          { $match: match },
          {
            $group: {
              _id: '$CountryCode',
              countryCode: { $first: '$CountryCode' },
              countryName: { $first: '$CountryName' },
              airportCount: { $sum: 1 },
              cities: { $addToSet: '$CityCode' },
            },
          },
          {
            $project: {
              _id: 0,
              countryCode: 1,
              countryName: 1,
              airportCount: 1,
              cityCount: { $size: '$cities' },
            },
          },
          { $sort: { countryName: 1 } },
          { $skip: skip },
          { $limit: l },
        ])
        .exec(),
      this.airportModel
        .aggregate<{ total: number }>([
          { $match: match },
          { $group: { _id: '$CountryCode' } },
          { $count: 'total' },
        ])
        .exec(),
    ]);

    return {
      data,
      total: totalResult[0]?.total ?? 0,
    };
  }

  /**
   * Bir ülkenin tüm havalimanlarını listeler (detay görünümü için).
   */
  async findAirportsByCountry(
    countryCode: string,
  ): Promise<CountryAirportItem[]> {
    const code = (countryCode || '').trim().toUpperCase();
    if (!code) return [];
    const list = await (this.airportModel as any)
      .aggregate([
        { $match: { CountryCode: code } },
        {
          $project: {
            _id: 0,
            airportCode: '$AirportCode',
            airportName: '$AirportName',
            cityCode: '$CityCode',
            cityName: '$CityName',
          },
        },
        { $sort: { cityName: 1, airportName: 1 } },
      ])
      .exec();
    return list as CountryAirportItem[];
  }

  /**
   * Sadece toplam ülke sayısı (dashboard için).
   */
  async count(): Promise<number> {
    const r = await this.airportModel
      .aggregate<{ total: number }>([
        { $group: { _id: '$CountryCode' } },
        { $count: 'total' },
      ])
      .exec();
    return r[0]?.total ?? 0;
  }
}
