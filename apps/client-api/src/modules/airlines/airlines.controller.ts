import { Controller, Get, Param } from '@nestjs/common';
import { AirlinesService } from './airlines.service';

@Controller('airlines')
export class AirlinesController {
  constructor(private readonly airlinesService: AirlinesService) {}

  @Get()
  async findAll() {
    const airlines = await this.airlinesService.findAll();
    return { success: true, airlines };
  }

  @Get(':code')
  async findByCode(@Param('code') code: string) {
    const airline = await this.airlinesService.findByCode(code);
    if (!airline) {
      return { success: false, airline: null };
    }
    return { success: true, airline };
  }
}
