import { Module } from '@nestjs/common';
import { BiletbankAuthModule } from '../../auth/auth.module';
import { BiletbankMakePaymentController } from './makepayment.controller';
import { BiletbankMakePaymentService } from './makepayment.service';
import { BiletbankInit3DPaymentController } from './init3dpayment.controller';
import { BiletbankInit3DPaymentService } from './init3dpayment.service';
import { BiletbankFinalizeShoppingController } from './finalizeshopping.controller';
import { BiletbankFinalizeShoppingService } from './finalizeshopping.service';

@Module({
  imports: [BiletbankAuthModule],
  controllers: [
    BiletbankMakePaymentController,
    BiletbankInit3DPaymentController,
    BiletbankFinalizeShoppingController,
  ],
  providers: [
    BiletbankMakePaymentService,
    BiletbankInit3DPaymentService,
    BiletbankFinalizeShoppingService,
  ],
  exports: [
    BiletbankMakePaymentService,
    BiletbankInit3DPaymentService,
    BiletbankFinalizeShoppingService,
  ],
})
export class BiletbankMakePaymentModule {}
