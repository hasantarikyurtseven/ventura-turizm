import {
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MakePaymentRequestDto } from '../../dto/makepayment-request.dto';
import { BiletbankConfigService } from '../../common/biletbank.config';
import { soapPost } from '../../common/soap.transport';
import { mapMakePaymentXmlToResponse } from './makepayment.mapper';

function maskSessionId(s?: string): string {
  if (!s || s.length < 4) return 'SESS-***';
  return `SESS-${s.substring(0, 2)}***${s.substring(s.length - 2)}`;
}

function escapeXml(val: string): string {
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

@Injectable()
export class BiletbankMakePaymentService {
  private readonly logger = new Logger(BiletbankMakePaymentService.name);

  constructor(private readonly cfg: BiletbankConfigService) {}

  async makePayment(dto: MakePaymentRequestDto): Promise<any> {
    const startTime = Date.now();
    const correlationId = randomUUID();
    const c = this.cfg.config;

    if (!dto.sessionId || !dto.sessionToken) {
      throw new BadRequestException('Session bilgileri eksik.');
    }
    if (!dto.shoppingFileId?.trim()) {
      throw new BadRequestException('ShoppingFileId gereklidir.');
    }
    if (dto.amount == null || dto.amount < 0) {
      throw new BadRequestException('Geçerli bir ödeme tutarı gereklidir.');
    }
    if (!dto.currency?.trim()) {
      throw new BadRequestException('Para birimi gereklidir.');
    }
    if (!dto.paymentType?.trim()) {
      throw new BadRequestException('Ödeme tipi gereklidir.');
    }

    const deductCommission = dto.deductLastSellerCommission === true ? 'true' : 'false';
    const isPartial = dto.isPartialPayment === true ? 'true' : 'false';

    this.logger.log('MakePayment started', {
      correlationId,
      sessionId: maskSessionId(dto.sessionId),
      shoppingFileId: dto.shoppingFileId,
      amount: dto.amount,
      currency: dto.currency,
      paymentType: dto.paymentType,
      isPartialPayment: dto.isPartialPayment,
    });

    const xml = `<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tem="http://tempuri.org/"
  xmlns:trev="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base"
  xmlns:trev1="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:MakePayment_FromRunningAccount>
         <tem:request>
            <trev:AuthenticationHeader>
               <trev:SessionId>${escapeXml(dto.sessionId)}</trev:SessionId>
               <trev:SessionToken>${escapeXml(dto.sessionToken)}</trev:SessionToken>
            </trev:AuthenticationHeader>
            <trev:ExtraParamList>
               <trev:ExtendedData/>
            </trev:ExtraParamList>
            <trev1:DeductLastSellerCommission>${deductCommission}</trev1:DeductLastSellerCommission>
            <trev1:PaymentForm>
               <trev1:Amount>${dto.amount}</trev1:Amount>
               <trev1:Currency>${escapeXml(dto.currency.trim())}</trev1:Currency>
               <trev1:IsPartialPayment>${isPartial}</trev1:IsPartialPayment>
               <trev1:PaymentType>${escapeXml(dto.paymentType.trim())}</trev1:PaymentType>
               <trev1:ShoppingFileId>${escapeXml(dto.shoppingFileId.trim())}</trev1:ShoppingFileId>
            </trev1:PaymentForm>
         </tem:request>
      </tem:MakePayment_FromRunningAccount>
   </soapenv:Body>
</soapenv:Envelope>`;

    try {
      const { rawXml } = await soapPost({
        url: c.apiUrl,
        clientKey: c.clientKey,
        soapAction: 'http://tempuri.org/I_Shopping/MakePayment_FromRunningAccount',
        xml,
        timeoutMs: 30000,
      });

      const elapsedTime = Date.now() - startTime;
      const mapped = mapMakePaymentXmlToResponse(rawXml);

      if (mapped.hasError) {
        const errorMessage = mapped.errorMessage || 'Ödeme işlemi tamamlanamadı.';
        const lowerMsg = errorMessage.toLowerCase();

        if (lowerMsg.includes('session') || lowerMsg.includes('unauthorized')) {
          this.logger.warn('MakePayment failed: Session invalid', {
            correlationId, errorMessage, elapsedTime,
          });
          throw new UnauthorizedException('Oturum süresi dolmuş. Lütfen yeniden arama yapın.');
        }

        if (lowerMsg.includes('balance') || lowerMsg.includes('insufficient') || lowerMsg.includes('yetersiz')) {
          this.logger.warn('MakePayment failed: Insufficient balance', {
            correlationId, errorMessage, elapsedTime,
          });
          throw new BadRequestException('Cari hesap bakiyeniz yetersiz. Lütfen bakiye yükleyin veya farklı bir ödeme yöntemi deneyin.');
        }

        this.logger.error('MakePayment failed', {
          correlationId, errorMessage, elapsedTime,
          sessionId: maskSessionId(dto.sessionId),
        });
        throw new BadRequestException(errorMessage);
      }

      const booking = mapped.airBookings?.[0];

      this.logger.log('MakePayment success', {
        correlationId,
        paymentId: mapped.paymentId,
        shoppingFileId: mapped.shoppingFileId,
        ifFinalized: mapped.ifFinalized,
        bookingCode: booking?.bookingCode,
        status: booking?.status,
        totalFare: booking?.totalFare,
        remainingSum: mapped.remainingSum,
        elapsedTime,
      });

      return {
        success: true,
        message: 'Ödeme başarıyla tamamlandı',
        correlationId,
        paymentId: mapped.paymentId,
        shoppingFileId: mapped.shoppingFileId,
        ifFinalized: mapped.ifFinalized,
        isPriceChanged: mapped.isPriceChanged,
        isFlightInfoChanged: mapped.isFlightInfoChanged,
        isReservationCancelled: mapped.isReservationCancelled,
        isCcPaymentEnabled: mapped.isCcPaymentEnabled,
        isRaPaymentEnabled: mapped.isRaPaymentEnabled,
        remainingSum: mapped.remainingSum,
        grandTotal: mapped.grandTotal,
        bookingCode: booking?.bookingCode,
        status: booking?.status,
        totalFare: booking?.totalFare,
        baseFare: booking?.baseFare,
        taxes: booking?.taxes,
        serviceFee: booking?.serviceFee,
        currency: booking?.currency,
        isRefundable: booking?.isRefundable,
        type: booking?.type,
        reservationDate: booking?.reservationDate,
        prebookingExpiresAt: booking?.prebookingExpiresAt,
        reservationExpiresAt: booking?.reservationExpiresAt,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      const elapsedTime = Date.now() - startTime;
      this.logger.error('MakePayment error', {
        correlationId,
        error: error instanceof Error ? error.message : String(error),
        elapsedTime,
        sessionId: maskSessionId(dto.sessionId),
      });
      throw new InternalServerErrorException(
        'Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.',
      );
    }
  }
}
