import {
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FinalizeShoppingRequestDto } from '../../dto/finalizeshopping-request.dto';
import { BiletbankConfigService } from '../../common/biletbank.config';
import { soapPost } from '../../common/soap.transport';
import { mapFinalizeShoppingXmlToResponse } from './finalizeshopping.mapper';

function escapeXml(val: string): string {
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

@Injectable()
export class BiletbankFinalizeShoppingService {
  private readonly logger = new Logger(BiletbankFinalizeShoppingService.name);

  constructor(private readonly cfg: BiletbankConfigService) {}

  async finalizeShopping(dto: FinalizeShoppingRequestDto): Promise<any> {
    const startTime = Date.now();
    const correlationId = randomUUID();
    const c = this.cfg.config;

    if (!dto.sessionId || !dto.sessionToken) {
      throw new BadRequestException('Session bilgileri eksik.');
    }
    if (!dto.shoppingFileId?.trim()) {
      throw new BadRequestException('ShoppingFileId gereklidir.');
    }
    if (!dto.billingName?.trim()) {
      throw new BadRequestException('Fatura adı gereklidir.');
    }

    this.logger.log('FinalizeShopping started', {
      correlationId,
      shoppingFileId: dto.shoppingFileId,
    });

    const xml = `<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:i="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:tem="http://tempuri.org/"
  xmlns:trev="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base"
  xmlns:trev1="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping"
  xmlns:trev2="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Shopping">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:FinalizeShopping>
         <tem:request>
            <trev:AuthenticationHeader>
               <trev:SessionId>${escapeXml(dto.sessionId)}</trev:SessionId>
               <trev:SessionToken>${escapeXml(dto.sessionToken)}</trev:SessionToken>
            </trev:AuthenticationHeader>
            <trev1:Form>
               <trev1:BillingInfo>
                  <trev2:Address_City>${escapeXml(dto.addressCity || 'ISTANBUL')}</trev2:Address_City>
                  <trev2:Address_Detail>${escapeXml(dto.addressDetail || '-')}</trev2:Address_Detail>
                  <trev2:Address_District>${escapeXml(dto.addressDistrict || '-')}</trev2:Address_District>
                  <trev2:Address_ZipCode>${escapeXml(dto.addressZipCode || '00000')}</trev2:Address_ZipCode>
                  <trev2:BillingName>${escapeXml(dto.billingName)}</trev2:BillingName>
                  <trev2:CountryCode>${escapeXml(dto.countryCode || 'TR')}</trev2:CountryCode>
                  <trev2:IfCompany>${dto.ifCompany ?? 0}</trev2:IfCompany>
                  <trev2:TaxNo>${escapeXml(dto.taxNo || '0000000000')}</trev2:TaxNo>
                  <trev2:TaxOffice>${escapeXml(dto.taxOffice || 'TEST')}</trev2:TaxOffice>
               </trev1:BillingInfo>
               <trev1:ShoppingFileId>${escapeXml(dto.shoppingFileId)}</trev1:ShoppingFileId>
            </trev1:Form>
         </tem:request>
      </tem:FinalizeShopping>
   </soapenv:Body>
</soapenv:Envelope>`;

    try {
      const { rawXml } = await soapPost({
        url: c.apiUrl,
        clientKey: c.clientKey,
        soapAction: 'http://tempuri.org/I_Shopping/FinalizeShopping',
        xml,
        timeoutMs: 30000,
      });

      const elapsedTime = Date.now() - startTime;
      const mapped = mapFinalizeShoppingXmlToResponse(rawXml);

      if (mapped.hasError) {
        const errorMessage = mapped.errorMessage || 'Rezervasyon tamamlanamadı.';
        const lowerMsg = errorMessage.toLowerCase();

        if (lowerMsg.includes('session') || lowerMsg.includes('unauthorized')) {
          this.logger.warn('FinalizeShopping failed: Session invalid', { correlationId, errorMessage });
          throw new UnauthorizedException('Oturum süresi dolmuş.');
        }

        this.logger.error('FinalizeShopping failed', { correlationId, errorMessage, elapsedTime });
        throw new BadRequestException({
          message: errorMessage,
          correlationId,
          elapsedTime,
          soapRequestXml: xml,
          soapResponseXml: rawXml,
        });
      }

      this.logger.log('FinalizeShopping success', {
        correlationId,
        bookingCode: mapped.bookingCode,
        ifFinalized: mapped.ifFinalized,
        elapsedTime,
      });

      return {
        success: true,
        message: 'Rezervasyon tamamlandı',
        correlationId,
        bookingCode: mapped.bookingCode,
        status: mapped.status,
        ifFinalized: mapped.ifFinalized,
        totalFare: mapped.totalFare,
        currency: mapped.currency,
        shoppingFileId: mapped.shoppingFileId,
        payment: {
          amount: mapped.paymentAmount,
          confirmedAmount: mapped.paymentConfirmedAmount,
          currency: mapped.paymentCurrency,
          cardNumber: mapped.ccCardNumber,
          cardHolder: mapped.ccCardHolder,
          bankName: mapped.ccBankName,
          installmentCount: mapped.ccInstallmentCount,
          finalizedDate: mapped.finalizedDate,
        },
        passengerName: mapped.passengerName,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      const elapsedTime = Date.now() - startTime;
      this.logger.error('FinalizeShopping error', {
        correlationId,
        error: error instanceof Error ? error.message : String(error),
        elapsedTime,
      });
      throw new InternalServerErrorException({
        message: 'Rezervasyon tamamlanırken hata oluştu.',
        correlationId,
        elapsedTime,
        soapRequestXml: xml,
      });
    }
  }
}
