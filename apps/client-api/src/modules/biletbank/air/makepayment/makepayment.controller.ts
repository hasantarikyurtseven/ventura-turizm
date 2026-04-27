import { Body, Controller, Post } from '@nestjs/common';
import { MakePaymentRequestDto } from '../../dto/makepayment-request.dto';
import { BiletbankMakePaymentService } from './makepayment.service';

@Controller('biletbank')
export class BiletbankMakePaymentController {
  constructor(private readonly service: BiletbankMakePaymentService) {}

  @Post('make-payment')
  async makePayment(@Body() body: MakePaymentRequestDto) {
    return await this.service.makePayment(body);
  }
}
