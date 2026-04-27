import {
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MakePrebookingRequestDto } from '../../dto/makeprebooking-request.dto';
import { BiletbankConfigService } from '../../common/biletbank.config';
import { soapPost } from '../../common/soap.transport';
import { mapMakePrebookingXmlToResponse } from './makeprebooking.mapper';

function maskSessionId(s?: string): string {
  if (!s || s.length < 4) return 'SESS-***';
  return `SESS-${s.substring(0, 2)}***${s.substring(s.length - 2)}`;
}

function maskSessionToken(t?: string): string {
  if (!t || t.length < 4) return 'TOK-***';
  return `TOK-${t.substring(0, 2)}***${t.substring(t.length - 2)}`;
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
export class BiletbankMakePrebookingService {
  private readonly logger = new Logger(BiletbankMakePrebookingService.name);

  constructor(private readonly cfg: BiletbankConfigService) {}

  async makePrebooking(dto: MakePrebookingRequestDto): Promise<any> {
    const startTime = Date.now();
    const correlationId = randomUUID();
    const c = this.cfg.config;

    if (!dto.sessionId || !dto.sessionToken) {
      throw new BadRequestException('Session bilgileri eksik.');
    }
    if (!dto.productId?.trim()) {
      throw new BadRequestException('ProductId gereklidir.');
    }
    if (!dto.shoppingFileId?.trim()) {
      throw new BadRequestException('ShoppingFileId gereklidir.');
    }

    this.logger.log('MakePreBooking started', {
      correlationId,
      sessionId: maskSessionId(dto.sessionId),
      productId: dto.productId,
      shoppingFileId: dto.shoppingFileId,
      brandedFareItemId: dto.brandedFareItemId || '(none)',
    });

    // Branded fare bölümü (opsiyonel)
    const brandedXml = dto.brandedFareItemId
      ? `
            <trev1:Branded>
               <trev1:IO_Air_Branded_Form>
                  ${dto.brandedCode ? `<trev1:BrandedCode>${escapeXml(dto.brandedCode)}</trev1:BrandedCode>` : ''}
                  <trev1:BrandedFareItemId>${escapeXml(dto.brandedFareItemId.trim())}</trev1:BrandedFareItemId>
                  <trev1:ProductId>${escapeXml(dto.productId.trim())}</trev1:ProductId>
               </trev1:IO_Air_Branded_Form>
            </trev1:Branded>`
      : '';

    const xml = `<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tem="http://tempuri.org/"
  xmlns:i="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:trev="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base"
  xmlns:trev1="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping"
  xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:MakePrebooking>
         <tem:request>
            <trev:AuthenticationHeader>
               <trev:SessionId>${escapeXml(dto.sessionId)}</trev:SessionId>
               <trev:SessionToken>${escapeXml(dto.sessionToken)}</trev:SessionToken>
            </trev:AuthenticationHeader>
            <trev:ExtraParamList>
               <trev:ExtendedData>
                  <trev:Name>IntendedShoppingFileId</trev:Name>
                  <trev:Type i:nil="true"/>
                  <trev:Value>${escapeXml(dto.shoppingFileId.trim())}</trev:Value>
               </trev:ExtendedData>
            </trev:ExtraParamList>
            <trev1:Form>${brandedXml}
               <trev1:CIPRequest i:nil="true"/>
               <trev1:ProductIds>
                  <arr:guid>${escapeXml(dto.productId.trim())}</arr:guid>
               </trev1:ProductIds>
            </trev1:Form>
         </tem:request>
      </tem:MakePrebooking>
   </soapenv:Body>
</soapenv:Envelope>`;

    try {
      const { rawXml } = await soapPost({
        url: c.apiUrl,
        clientKey: c.clientKey,
        soapAction: 'http://tempuri.org/I_Shopping/MakePrebooking',
        xml,
        timeoutMs: 60000,
      });

      const elapsedTime = Date.now() - startTime;
      const mapped = mapMakePrebookingXmlToResponse(rawXml);

      if (mapped.hasError) {
        const errorMessage = mapped.errorMessage || 'Ön rezervasyon oluşturulamadı.';
        const lowerMsg = errorMessage.toLowerCase();

        if (lowerMsg.includes('session') || lowerMsg.includes('unauthorized')) {
          this.logger.warn('MakePreBooking failed: Session invalid', {
            correlationId, errorMessage, elapsedTime,
            sessionId: maskSessionId(dto.sessionId),
          });
          throw new UnauthorizedException('Oturum süresi dolmuş. Lütfen yeniden arama yapın.');
        }

        // BiletBank iç sistem hatası (UnknownSystemError) + ShoppingFile verisi mevcutsa
        // uyarı logla ama kısmi veriyle devam et
        const hasPartialData = !!mapped.shoppingFileId;
        if (mapped.isUnknownSystemError && hasPartialData) {
          this.logger.warn('MakePreBooking: BiletBank internal error, continuing with partial ShoppingFile data', {
            correlationId, errorMessage, elapsedTime,
            shoppingFileId: mapped.shoppingFileId,
            isCcPaymentEnabled: mapped.isCcPaymentEnabled,
            isRaPaymentEnabled: mapped.isRaPaymentEnabled,
          });
          // Devam et — hatayı yut, kısmi veriye warnings ile dön
        } else {
          this.logger.error('MakePreBooking failed', {
            correlationId, errorMessage, elapsedTime,
            sessionId: maskSessionId(dto.sessionId),
            sessionToken: maskSessionToken(dto.sessionToken),
          });
          throw new BadRequestException(errorMessage);
        }
      }

      const booking = mapped.airBookings?.[0];

      this.logger.log('MakePreBooking success', {
        correlationId,
        shoppingFileId: mapped.shoppingFileId,
        status: booking?.status,
        bookingCode: booking?.bookingCode,
        isPriceChanged: mapped.isPriceChanged,
        isFlightInfoChanged: mapped.isFlightInfoChanged,
        isCcPaymentEnabled: mapped.isCcPaymentEnabled,
        isRaPaymentEnabled: mapped.isRaPaymentEnabled,
        remainingSum: mapped.remainingSum,
        prebookingExpiresAt: booking?.prebookingExpiresAt,
        reservationExpiresAt: booking?.reservationExpiresAt,
        elapsedTime,
      });

      return {
        success: true,
        message: mapped.hasError
          ? 'Ön rezervasyon oluşturulamadı ancak rezervasyon bilgileri alındı'
          : 'Ön rezervasyon başarıyla oluşturuldu',
        biletbankWarning: mapped.hasError ? mapped.errorMessage : undefined,
        correlationId,
        shoppingFileId: mapped.shoppingFileId,
        ifFinalized: mapped.ifFinalized,
        isPriceChanged: mapped.isPriceChanged,
        isFlightInfoChanged: mapped.isFlightInfoChanged,
        isReservationCancelled: mapped.isReservationCancelled,
        isCcPaymentEnabled: mapped.isCcPaymentEnabled,
        isRaPaymentEnabled: mapped.isRaPaymentEnabled,
        remainingSum: mapped.remainingSum,
        maxSc: mapped.maxSc,
        minSc: mapped.minSc,
        bookingCode: booking?.bookingCode,
        status: booking?.status,
        totalFare: booking?.totalFare,
        baseFare: booking?.baseFare,
        taxes: booking?.taxes,
        serviceFee: booking?.serviceFee,
        currency: booking?.currency,
        canBeReserved: booking?.canBeReserved,
        prebookingExpiresAt: booking?.prebookingExpiresAt,
        reservationExpiresAt: booking?.reservationExpiresAt,
        reservationDate: booking?.reservationDate,
        paxReferences: booking?.paxReferences,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      const elapsedTime = Date.now() - startTime;
      this.logger.error('MakePreBooking error', {
        correlationId,
        error: error instanceof Error ? error.message : String(error),
        elapsedTime,
        sessionId: maskSessionId(dto.sessionId),
      });
      throw new InternalServerErrorException(
        'Ön rezervasyon sırasında bir hata oluştu. Lütfen tekrar deneyin.',
      );
    }
  }
}
