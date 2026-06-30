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

    const productIds = Array.from(new Set((dto.productIds?.length ? dto.productIds : [dto.productId])
      .map((productId) => productId?.trim())
      .filter((productId): productId is string => Boolean(productId))));

    if (!productIds.length) {
      throw new BadRequestException('ProductId gereklidir.');
    }
    if (!dto.shoppingFileId?.trim()) {
      throw new BadRequestException('ShoppingFileId gereklidir.');
    }

    this.logger.log('MakePreBooking started', {
      correlationId,
      sessionId: maskSessionId(dto.sessionId),
      productId: dto.productId,
      productIds,
      shoppingFileId: dto.shoppingFileId,
      brandedFareItemId: dto.brandedFareItemId || '(none)',
    });

    // Branded fare bölümü (opsiyonel)
    const brandedItems = dto.brandedItems?.length
      ? dto.brandedItems
      : dto.brandedFareItemId
        ? [{
            productId: dto.productId,
            brandedFareItemId: dto.brandedFareItemId,
            brandedCode: dto.brandedCode,
          }]
        : [];

    const buildBrandedFormsXml = (withBrandedFareItemId: boolean) =>
      brandedItems
        .filter((item) => item.productId?.trim())
        .map((item) => `
               <trev1:IO_Air_Branded_Form>
                  ${withBrandedFareItemId && item.brandedFareItemId?.trim() ? `<trev1:BrandedFareItemId>${escapeXml(item.brandedFareItemId!.trim())}</trev1:BrandedFareItemId>` : ''}
                  <trev1:ProductId>${escapeXml(item.productId.trim())}</trev1:ProductId>
               </trev1:IO_Air_Branded_Form>`)
        .join('');

    const buildBrandedXml = (withBrandedFareItemId: boolean) => {
      const formsXml = buildBrandedFormsXml(withBrandedFareItemId);
      return formsXml
        ? `
            <trev1:Branded>
${formsXml}
            </trev1:Branded>`
        : '';
    };

    const productIdsXml = productIds
      .map((productId) => `
                  <arr:guid>${escapeXml(productId)}</arr:guid>`)
      .join('');

    const buildXml = (withBrandedFareItemId: boolean, doReservation = true) => {
      const brandedXml = buildBrandedXml(withBrandedFareItemId);
      return `<soapenv:Envelope
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
                  <trev:Type>True</trev:Type>
                  <trev:Value>${escapeXml(dto.shoppingFileId.trim())}</trev:Value>
               </trev:ExtendedData>
               <trev:ExtendedData>
                  <trev:Name>DoReservation</trev:Name>
                  <trev:Type>true</trev:Type>
                  <trev:Value>${doReservation ? 'true' : 'false'}</trev:Value>
               </trev:ExtendedData>
            </trev:ExtraParamList>
            <trev1:Form>${brandedXml}
               <trev1:CIPRequest/>
               <trev1:ExtraForm>
                  <trev1:SelectedServiceFee>0</trev1:SelectedServiceFee>
               </trev1:ExtraForm>
               <trev1:CIPRequest/>
               <trev1:ProductIds>${productIdsXml}
               </trev1:ProductIds>
            </trev1:Form>
         </tem:request>
      </tem:MakePrebooking>
   </soapenv:Body>
</soapenv:Envelope>`;
    };

    const xml = buildXml(true, true);

    this.logger.log('[MakePrebooking] SOAP REQUEST XML:\n' + xml);

    try {
      const { rawXml } = await soapPost({
        url: c.apiUrl,
        clientKey: c.clientKey,
        soapAction: 'http://tempuri.org/I_Shopping/MakePrebooking',
        xml,
        timeoutMs: 60000,
      });

      const elapsedTime = Date.now() - startTime;
      this.logger.log('[MakePrebooking] SOAP RESPONSE XML (first 3000 chars):\n' + rawXml.substring(0, 3000));
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

        const hasPartialData = !!mapped.shoppingFileId;
        if (mapped.isUnknownSystemError && hasPartialData) {
          this.logger.warn('MakePreBooking: BiletBank internal error, continuing with partial ShoppingFile data', {
            correlationId, errorMessage, elapsedTime,
            shoppingFileId: mapped.shoppingFileId,
            isCcPaymentEnabled: mapped.isCcPaymentEnabled,
            isRaPaymentEnabled: mapped.isRaPaymentEnabled,
          });
        } else if (lowerMsg.includes('unexpected provider error') || lowerMsg.includes('providerpricing')) {
          this.logger.warn('MakePreBooking: ProviderPricingError — retrying with DoReservation=false', {
            correlationId, errorMessage, elapsedTime,
            productIds,
          });
          const retryXml = buildXml(false, false);
          this.logger.log('[MakePrebooking] RETRY (DoReservation=false) SOAP REQUEST XML:\n' + retryXml);
          const retryResult = await soapPost({
            url: c.apiUrl,
            clientKey: c.clientKey,
            soapAction: 'http://tempuri.org/I_Shopping/MakePrebooking',
            xml: retryXml,
            timeoutMs: 60000,
          });
          this.logger.log('[MakePrebooking] RETRY SOAP RESPONSE XML (first 3000 chars):\n' + retryResult.rawXml.substring(0, 3000));
          const retryMapped = mapMakePrebookingXmlToResponse(retryResult.rawXml);
          if (retryMapped.hasError) {
            const retryError = retryMapped.errorMessage || errorMessage;
            const retryLower = retryError.toLowerCase();
            const hasRetryShoppingFile = !!retryMapped.shoppingFileId || !!mapped.shoppingFileId;
            const isStillProviderError = retryLower.includes('unexpected provider error') || retryLower.includes('providerpricing');
            if (isStillProviderError && hasRetryShoppingFile) {
              this.logger.warn('MakePreBooking: ProviderPricingError on retry — continuing with ShoppingFile data', {
                correlationId, retryError, elapsedTime,
                shoppingFileId: retryMapped.shoppingFileId || mapped.shoppingFileId,
                retryTotalFare: retryMapped.airBookings?.[0]?.totalFare,
                originalTotalFare: mapped.airBookings?.[0]?.totalFare,
              });
              if (retryMapped.shoppingFileId) mapped.shoppingFileId = retryMapped.shoppingFileId;
              if (retryMapped.airBookings?.length) mapped.airBookings = retryMapped.airBookings;
              if (retryMapped.remainingSum !== undefined) mapped.remainingSum = retryMapped.remainingSum;
              if (retryMapped.isPriceChanged !== undefined) mapped.isPriceChanged = retryMapped.isPriceChanged;
              if (retryMapped.isFlightInfoChanged !== undefined) mapped.isFlightInfoChanged = retryMapped.isFlightInfoChanged;
              if (retryMapped.isCcPaymentEnabled !== undefined) mapped.isCcPaymentEnabled = retryMapped.isCcPaymentEnabled;
              if (retryMapped.isRaPaymentEnabled !== undefined) mapped.isRaPaymentEnabled = retryMapped.isRaPaymentEnabled;
            } else {
              this.logger.error('MakePreBooking retry failed', {
                correlationId, retryError, elapsedTime,
                sessionId: maskSessionId(dto.sessionId),
              });
              throw new BadRequestException(retryError);
            }
          } else {
            Object.assign(mapped, retryMapped);
          }
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

      const prebookingWorked = (mapped.remainingSum ?? 0) > 0 ||
        booking?.status?.toLowerCase().includes('prebooking') ||
        booking?.status?.toLowerCase().includes('reservation');

      if (!prebookingWorked) {
        this.logger.warn('MakePreBooking: BiletBank accepted request but did NOT transition state (RemainingSum=0, status unchanged)', {
          correlationId,
          shoppingFileId: mapped.shoppingFileId,
          status: booking?.status,
          remainingSum: mapped.remainingSum,
          totalFare: booking?.totalFare,
          productIds,
          elapsedTime,
        });
      }

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
