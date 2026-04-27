import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin/roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
    constructor(private rolesService: RolesService) { }

    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search?: string,
    ) {
        return this.rolesService.findAll(+page, +limit, search);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.rolesService.findById(id);
    }

    @Post()
    async create(@Body() roleData: any) {
        return this.rolesService.create(roleData);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() roleData: any) {
        return this.rolesService.update(id, roleData);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.rolesService.delete(id);
        return { message: 'Role deleted successfully' };
    }
}
