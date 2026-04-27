import { Controller, Get, Param, Put, Body, Query, UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin/members')
@UseGuards(JwtAuthGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('emailVerified') emailVerified?: string,
  ) {
    return this.membersService.findAll(+page, +limit, search, status, emailVerified);
  }

  @Get('stats')
  async getStats() {
    return this.membersService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.membersService.findById(id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.membersService.updateStatus(id, status);
  }
}
