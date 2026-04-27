import { Controller, Get, Query } from '@nestjs/common';
import { AirportsService } from './airports.service';

@Controller('airports')
export class AirportsQueryController {
  constructor(private readonly airportsService: AirportsService) {}

  @Get('countries')
  async getCountries() {
    const countries = await this.airportsService.getCountries();
    return {
      success: true,
      countries,
    };
  }

  @Get()
  async searchAirports(
    @Query('countryCode') countryCode?: string,
    @Query('q') q?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) || 100 : 100;
    const airports = await this.airportsService.searchAirports({
      countryCode,
      query: q,
      limit: parsedLimit,
    });
    return {
      success: true,
      airports,
    };
  }
}

