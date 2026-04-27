import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin/permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
    constructor(private permissionsService: PermissionsService) { }

    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search?: string,
    ) {
        return this.permissionsService.findAll(+page, +limit, search);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.permissionsService.findById(id);
    }

    @Post()
    async create(@Body() permissionData: any) {
        return this.permissionsService.create(permissionData);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() permissionData: any) {
        return this.permissionsService.update(id, permissionData);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.permissionsService.delete(id);
        return { message: 'Permission deleted successfully' };
    }
}
