import { Controller, Get, Param } from '@nestjs/common';
import { ContractsService } from './contracts.service';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  async findAll() {
    const data = await this.contractsService.findAll();
    return { success: true, data };
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const contract = await this.contractsService.findBySlug(slug);
    if (!contract) {
      return { success: false, contract: null };
    }
    return { success: true, contract };
  }
}
