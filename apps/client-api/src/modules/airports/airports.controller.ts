import { Controller, Post } from '@nestjs/common';
import { AirportsService } from './airports.service';

@Controller('admin/airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  /**
   * Bir defalık Excel import endpoint'i.
   * Postman ile çağırıp sonrasında modülü silebilirsiniz.
   */
  @Post('import')
  async importFromExcel() {
    const filePath =
      '/Users/tarik/Documents/projeler/ventura-turizm/Airports&Cities&Countries EN.xlsx';

    const result = await this.airportsService.importFromExcel(filePath);
    return {
      success: true,
      message: 'Airports imported from Excel',
      inserted: result.inserted,
    };
  }
}

