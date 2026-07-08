import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { HelpService } from './help.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin/help')
@UseGuards(JwtAuthGuard)
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  // --- FAQ ---
  @Get('faqs')
  findAllFaqs() { return this.helpService.findAllFaqs(); }

  @Post('faqs')
  createFaq(@Body() dto: any) { return this.helpService.createFaq(dto); }

  @Put('faqs/:id')
  updateFaq(@Param('id') id: string, @Body() dto: any) { return this.helpService.updateFaq(id, dto); }

  @Delete('faqs/:id')
  removeFaq(@Param('id') id: string) { return this.helpService.removeFaq(id); }

  // --- Contact Messages ---
  @Get('messages')
  findAllMessages(@Query('page') page = 1, @Query('limit') limit = 20, @Query('status') status?: string) {
    return this.helpService.findAllMessages(page, limit, status);
  }

  @Get('messages/stats')
  getMessageStats() { return this.helpService.getMessageStats(); }

  @Put('messages/:id/status')
  updateMessageStatus(@Param('id') id: string, @Body() body: { status: string; adminNote?: string }) {
    return this.helpService.updateMessageStatus(id, body.status, body.adminNote);
  }
}
