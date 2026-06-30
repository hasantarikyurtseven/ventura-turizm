import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin/countries')
@UseGuards(JwtAuthGuard)
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  /** Sayfalı ülke listesi (airports collection'ından distinct) */
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query('search') search?: string,
  ) {
    return this.countriesService.findAll(+page, +limit, search);
  }

  /** Bir ülkenin havalimanları */
  @Get(':code/airports')
  async findAirports(@Param('code') code: string) {
    return this.countriesService.findAirportsByCountry(code);
  }
}
