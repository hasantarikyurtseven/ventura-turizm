import { Body, Controller, Post } from '@nestjs/common';
import { Init3DPaymentRequestDto } from '../../dto/init3dpayment-request.dto';
import { BiletbankInit3DPaymentService } from './init3dpayment.service';

@Controller('biletbank')
export class BiletbankInit3DPaymentController {
  constructor(private readonly service: BiletbankInit3DPaymentService) {}

  @Post('init-3d-payment')
  async init3DPayment(@Body() body: Init3DPaymentRequestDto) {
    return await this.service.init3DPayment(body);
  }
}
