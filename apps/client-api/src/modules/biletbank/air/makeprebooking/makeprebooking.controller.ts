import { Body, Controller, Post } from '@nestjs/common';
import { MakePrebookingRequestDto } from '../../dto/makeprebooking-request.dto';
import { BiletbankMakePrebookingService } from './makeprebooking.service';

@Controller('biletbank')
export class BiletbankMakePrebookingController {
  constructor(private readonly service: BiletbankMakePrebookingService) {}

  @Post('make-prebooking')
  async makePrebooking(@Body() body: MakePrebookingRequestDto) {
    return await this.service.makePrebooking(body);
  }
}
