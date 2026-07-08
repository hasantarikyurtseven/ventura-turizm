import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as XLSX from 'xlsx';
import { Airport } from './airports.schema';

@Injectable()
export class AirportsService {
  private readonly logger = new Logger(AirportsService.name);

  constructor(
    @InjectModel(Airport.name)
    private readonly airportModel: Model<Airport>,
  ) {}

  /**
   * Excel dosyasını okuyup MongoDB'ye aktarır.
   * Bu methodu bir defalık çalıştırıp sonra modülü silebilirsiniz.
   */
  async importFromExcel(filePath: string): Promise<{ inserted: number }> {
    this.logger.log(`Starting import from Excel: ${filePath}`);

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
      defval: '',
    });

    if (!rows.length) {
      this.logger.warn('No rows parsed from Excel. Check sheet/headers.');
      return { inserted: 0 };
    }

    await this.airportModel.deleteMany({});

    const docs = rows
      .map((row) => {
        const cityCode = String(row.CityCode || '').trim();
        const cityName = String(row.CityName || '').trim();
        const airportCode = String(row.AirportCode || '').trim();
        const airportName = String(row.AirportName || '').trim();
        const countryCode = String(row.CountryCode || '').trim();
        const countryName = String(row.CountryName || '').trim();
        const timeZoneId = String(row.TimeZoneId || '').trim();
        const rating = String(row.Rating || '').trim();

        if (!cityCode && !airportCode) {
          return null;
        }

        const searchName = this.buildSearchName({
          cityName,
          countryName,
          cityCode,
          airportName,
          airportCode,
        });

        return {
          cityCode,
          cityName,
          airportCode,
          airportName,
          countryCode,
          countryName,
          timeZoneId: timeZoneId || undefined,
          rating: rating || undefined,
          searchName,
        } as Partial<Airport>;
      })
      .filter(Boolean) as Partial<Airport>[];

    if (!docs.length) {
      this.logger.warn('After mapping, no valid airport documents found.');
      return { inserted: 0 };
    }

    const result = await this.airportModel.insertMany(docs, {
      ordered: false,
    });

    this.logger.log(`Imported ${result.length} airports from Excel.`);
    return { inserted: result.length };
  }

  /**
   * Ülkeler listesini (distinct) döner.
   */
  async getCountries(): Promise<
    { countryCode: string; countryName: string }[]
  > {
    const pipeline = [
      {
        $group: {
          _id: {
            countryCode: '$countryCode',
            countryName: '$countryName',
          },
        },
      },
      {
        $project: {
          _id: 0,
          countryCode: '$_id.countryCode',
          countryName: '$_id.countryName',
        },
      },
      {
        $sort: { countryName: 1 },
      },
    ];

    const rows = await (this.airportModel as any).aggregate(pipeline).exec();
    return rows;
  }

  /**
   * Belirli bir ülke için havalimanı/şehir listesi döner.
   * Q parametresi ile cityName / airportName / airportCode üzerinde arama yapılır.
   */
  async searchAirports(params: {
    countryCode?: string;
    query?: string;
    limit?: number;
  }): Promise<
    {
      cityCode: string;
      cityName: string;
      airportCode: string;
      airportName: string;
      countryCode: string;
      countryName: string;
      timeZoneId?: string;
    }[]
  > {
    const { countryCode, query, limit = 100 } = params;
    const pipeline: any[] = [];

    if (countryCode) {
      pipeline.push({
        $match: {
          countryCode: countryCode.toUpperCase(),
        },
      });
    }

    if (query && query.trim()) {
      const q = query.trim();
      pipeline.push({
        $match: {
          $or: [
            { cityName:    { $regex: q, $options: 'i' } },
            { airportName: { $regex: q, $options: 'i' } },
            { airportCode: { $regex: `^${q}`, $options: 'i' } },
            { searchName:  { $regex: q, $options: 'i' } },
          ],
        },
      });
    }

    pipeline.push({ $sort: { cityName: 1, airportName: 1 } });
    pipeline.push({ $limit: limit });

    const rows = await (this.airportModel as any).aggregate(pipeline).exec();

    return rows.map((row: any) => ({
      cityCode:    row.cityCode,
      cityName:    row.cityName,
      airportCode: row.airportCode,
      airportName: row.airportName,
      countryCode: row.countryCode,
      countryName: row.countryName,
      timeZoneId:  row.timeZoneId,
    }));
  }

  private buildSearchName(args: {
    cityName: string;
    countryName: string;
    cityCode: string;
    airportName: string;
    airportCode: string;
  }): string {
    const { cityName, countryName, cityCode, airportName, airportCode } = args;

    if (airportCode) {
      const left = airportName ? `${airportName} (${airportCode})` : airportCode;
      const rightParts: string[] = [];
      if (cityName) rightParts.push(cityName);
      if (countryName) rightParts.push(countryName);
      const right = rightParts.length ? rightParts.join(', ') : '';
      return right ? `${left} · ${right}` : left;
    }

    if (cityCode) {
      const left = cityName ? `${cityName} (${cityCode})` : cityCode;
      const right = countryName || '';
      return right ? `${left} · ${right}` : left;
    }

    return '';
  }
}

