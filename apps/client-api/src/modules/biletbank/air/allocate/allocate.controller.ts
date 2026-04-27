import { Body, Controller, Post } from '@nestjs/common';
import { AllocateRequestDto } from '../../dto/allocate-request.dto';
import { BiletbankAllocateService } from './allocate.service';

@Controller('biletbank')
export class BiletbankAllocateController {
  constructor(private readonly allocateService: BiletbankAllocateService) {}

  @Post('allocate')
  // @UseGuards(BookingAuthGuard) // Geçici olarak devre dışı - AirSearch ile aynı şekilde
  async allocate(@Body() body: AllocateRequestDto) {
    return await this.allocateService.allocate(body);
  }
}
