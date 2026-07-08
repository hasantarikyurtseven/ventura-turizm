import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin/blog')
@UseGuards(JwtAuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 20,
          @Query('search') search?: string, @Query('status') status?: string) {
    return this.blogService.findAll(page, limit, search, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.blogService.findOne(id); }

  @Post()
  create(@Body() dto: any) { return this.blogService.create(dto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) { return this.blogService.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.blogService.remove(id); }
}
