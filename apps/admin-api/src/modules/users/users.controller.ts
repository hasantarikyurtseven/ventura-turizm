import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search?: string,
    ) {
        return this.usersService.findAll(+page, +limit, search);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Post()
    async create(@Body() userData: any) {
        return this.usersService.create(userData);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() userData: any) {
        return this.usersService.update(id, userData);
    }

    @Put(':id/password')
    async changePassword(
        @Param('id') id: string,
        @Body() body: { currentPassword: string; newPassword: string }
    ) {
        return this.usersService.changePassword(id, body.currentPassword, body.newPassword);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.usersService.delete(id);
        return { message: 'User deleted successfully' };
    }
}
