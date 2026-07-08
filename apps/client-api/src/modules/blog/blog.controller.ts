import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('category') category?: string) {
    return this.blogService.findAll(page, limit, category);
  }

  @Get('categories')
  getCategories() { return this.blogService.getCategories(); }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) { return this.blogService.findBySlug(slug); }
}
