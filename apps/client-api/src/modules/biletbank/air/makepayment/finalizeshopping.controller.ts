import { Body, Controller, Post } from '@nestjs/common';
import { FinalizeShoppingRequestDto } from '../../dto/finalizeshopping-request.dto';
import { BiletbankFinalizeShoppingService } from './finalizeshopping.service';

@Controller('biletbank')
export class BiletbankFinalizeShoppingController {
  constructor(private readonly service: BiletbankFinalizeShoppingService) {}

  @Post('finalize-shopping')
  async finalizeShopping(@Body() body: FinalizeShoppingRequestDto) {
    return await this.service.finalizeShopping(body);
  }
}
