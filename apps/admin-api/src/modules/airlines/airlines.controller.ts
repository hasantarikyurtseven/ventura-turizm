import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AirlinesService } from './airlines.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin/airlines')
@UseGuards(JwtAuthGuard)
export class AirlinesController {
    constructor(private airlinesService: AirlinesService) {}

    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 50,
        @Query('search') search?: string,
    ) {
        return this.airlinesService.findAll(+page, +limit, search);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.airlinesService.findById(id);
    }

    @Post()
    async create(@Body() data: any) {
        return this.airlinesService.create(data);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: any) {
        return this.airlinesService.update(id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.airlinesService.delete(id);
        return { message: 'Havayolu silindi.' };
    }
}
