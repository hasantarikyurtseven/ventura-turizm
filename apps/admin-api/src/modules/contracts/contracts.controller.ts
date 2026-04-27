import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin/contracts')
@UseGuards(JwtAuthGuard)
export class ContractsController {
    constructor(private contractsService: ContractsService) {}

    @Get()
    async findAll() {
        const data = await this.contractsService.findAll();
        return { data };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.contractsService.findById(id);
    }

    @Post()
    async create(@Body() body: { title: string; content?: string }) {
        return this.contractsService.create(body);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: { title?: string; content?: string }) {
        return this.contractsService.update(id, body);
    }
}
