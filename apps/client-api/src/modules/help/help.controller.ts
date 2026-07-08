import { Controller, Get, Post, Body } from '@nestjs/common';
import { HelpService } from './help.service';

@Controller('help')
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  @Get('faqs')
  getFaqs() { return this.helpService.getFaqs(); }

  @Post('contact')
  submitContact(@Body() dto: { name: string; email: string; phone?: string; subject: string; message: string }) {
    return this.helpService.submitContact(dto);
  }
}
