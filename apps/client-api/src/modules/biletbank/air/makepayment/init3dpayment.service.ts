import {
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Init3DPaymentRequestDto } from '../../dto/init3dpayment-request.dto';
import { BiletbankConfigService } from '../../common/biletbank.config';
import { soapPost } from '../../common/soap.transport';
import { mapInit3DPaymentXmlToResponse } from './init3dpayment.mapper';

function maskSessionId(s?: string): string {
  if (!s || s.length < 4) return 'SESS-***';
  return `SESS-${s.substring(0, 2)}***${s.substring(s.length - 2)}`;
}

function maskCardNumber(num?: string): string {
  if (!num || num.length < 4) return '****';
  const digits = num.replace(/\D/g, '');
  return `${digits.slice(0, 4)} **** **** ${digits.slice(-4)}`;
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
export class BiletbankInit3DPaymentService {
  private readonly logger = new Logger(BiletbankInit3DPaymentService.name);

  constructor(private readonly cfg: BiletbankConfigService) {}

  async init3DPayment(dto: Init3DPaymentRequestDto): Promise<any> {
    const startTime = Date.now();
    const correlationId = randomUUID();
    const c = this.cfg.config;

    if (!dto.sessionId || !dto.sessionToken) {
      throw new BadRequestException('Session bilgileri eksik.');
    }
    if (!dto.shoppingFileId?.trim()) {
      throw new BadRequestException('ShoppingFileId gereklidir.');
    }
    if (!dto.cardNumber?.trim() || !dto.cardHolderName?.trim()) {
      throw new BadRequestException('Kart bilgileri eksik.');
    }
    if (!dto.expireMonth?.trim() || !dto.expireYear?.trim() || !dto.cvv?.trim()) {
      throw new BadRequestException('Kart son kullanma tarihi ve CVV gereklidir.');
    }
    if (!dto.callbackUrl?.trim()) {
      throw new BadRequestException('CallbackUrl gereklidir.');
    }

    // CardNumber: tire formatında gönder (BiletBank başarılı örnek: "4546-7112-3456-7894")
    const digits = dto.cardNumber.replace(/\D/g, '');
    const formattedCardNumber = digits.replace(/(\d{4})(?=\d)/g, '$1-');

    // ExpirationMonth: integer (örn: "03" → 3)
    const expirationMonth = parseInt(dto.expireMonth.trim(), 10);
    // ExpirationYear: BiletBank 2 hane ister ("26" değil "2026" değil)
    const rawYear = parseInt(dto.expireYear.trim(), 10);
    const expirationYear = rawYear >= 100 ? rawYear % 100 : rawYear;

    const amount = Number(dto.amount);

    if (!amount || amount <= 0) {
      throw new BadRequestException('Ödeme tutarı geçersiz. Lütfen rezervasyon akışını yeniden başlatın.');
    }

    this.logger.log('Init3DPayment started', {
      correlationId,
      sessionId: maskSessionId(dto.sessionId),
      shoppingFileId: dto.shoppingFileId,
      amount,
      currency: dto.currency,
      card: maskCardNumber(digits),
    });

    // Amount: tam hassasiyet koru, ondalıksızsa ".0" ekle (BiletBank örnek: "3405.0", "18192.74")
    const amountFormatted = Number.isInteger(amount) ? `${amount}.0` : String(amount);

    // Taksit alanları (opsiyonel)
    const installmentFields = [
      dto.bonusInstallmentCount != null
        ? `               <trev1:BonusInstallmentCount>${dto.bonusInstallmentCount}</trev1:BonusInstallmentCount>`
        : null,
      dto.installmentCount != null
        ? `               <trev1:InstallmentCount>${dto.installmentCount}</trev1:InstallmentCount>`
        : null,
      dto.installmentOptionId?.trim()
        ? `               <trev1:InstallmentOptionId>${escapeXml(dto.installmentOptionId.trim())}</trev1:InstallmentOptionId>`
        : null,
      dto.installmentAmountOfInterest != null
        ? `               <trev1:Installment_AmountOfInterest>${dto.installmentAmountOfInterest}</trev1:Installment_AmountOfInterest>`
        : null,
      dto.installmentRateOfInterest != null
        ? `               <trev1:Installment_RateOfInterest>${dto.installmentRateOfInterest}</trev1:Installment_RateOfInterest>`
        : null,
    ]
      .filter(Boolean)
      .join('\n');

    // IO_Init3DPayment_Request (T_OperationRequest tabanlı)
    // Form alanları WCF şeması sırasıyla (alfabetik):
    //   Amount, BillingName, BonusInstallmentCount, CV2, CardHolder, CardNumber,
    //   CardType, Currency, ExpirationMonth, ExpirationYear, InstallmentCount,
    //   InstallmentOptionId, Installment_AmountOfInterest, Installment_RateOfInterest,
    //   OriginalAmount, ReturnUrl, ShoppingFileId
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:trev="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base" xmlns:trev1="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:MakePayment_Init3DPayment>
         <tem:request>
            <trev:AuthenticationHeader>
               <trev:SessionId>${escapeXml(dto.sessionId)}</trev:SessionId>
               <trev:SessionToken>${escapeXml(dto.sessionToken)}</trev:SessionToken>
            </trev:AuthenticationHeader>
            <trev:ExtraParamList>
            </trev:ExtraParamList>
            <trev1:DeductLastSellerCommission>false</trev1:DeductLastSellerCommission>
            <trev1:Form>
               <trev1:Amount>${amountFormatted}</trev1:Amount>
               <trev1:BillingName>${escapeXml(dto.cardHolderName.trim().toUpperCase())}</trev1:BillingName>
               <trev1:CV2>${escapeXml(dto.cvv.trim())}</trev1:CV2>
               <trev1:CardHolder>${escapeXml(dto.cardHolderName.trim().toUpperCase())}</trev1:CardHolder>
               <trev1:CardNumber>${escapeXml(formattedCardNumber)}</trev1:CardNumber>
               <trev1:CardType/>
               <trev1:Currency>${escapeXml(dto.currency.trim())}</trev1:Currency>
               <trev1:ExpirationMonth>${expirationMonth}</trev1:ExpirationMonth>
               <trev1:ExpirationYear>${expirationYear}</trev1:ExpirationYear>${installmentFields ? '\n' + installmentFields : ''}
               <trev1:OriginalAmount>${amountFormatted}</trev1:OriginalAmount>
               <trev1:ReturnUrl>${escapeXml(dto.callbackUrl.trim())}</trev1:ReturnUrl>
               <trev1:ShoppingFileId>${escapeXml(dto.shoppingFileId.trim())}</trev1:ShoppingFileId>
            </trev1:Form>
         </tem:request>
      </tem:MakePayment_Init3DPayment>
   </soapenv:Body>
</soapenv:Envelope>`;

    const debugRequestXml = xml;

    try {
      const { rawXml } = await soapPost({
        url: c.apiUrl,
        clientKey: c.clientKey,
        soapAction: 'http://tempuri.org/I_Shopping/MakePayment_Init3DPayment',
        xml,
        timeoutMs: 30000,
      });

      const elapsedTime = Date.now() - startTime;
      const mapped = mapInit3DPaymentXmlToResponse(rawXml);

      if (mapped.hasError) {
        const errorMessage = mapped.errorMessage || '3D ödeme başlatılamadı.';
        const lowerMsg = errorMessage.toLowerCase();

        if (lowerMsg.includes('session') || lowerMsg.includes('unauthorized')) {
          this.logger.warn('Init3DPayment failed: Session invalid', { correlationId, errorMessage });
          throw new UnauthorizedException('Oturum süresi dolmuş. Lütfen yeniden arama yapın.');
        }

        this.logger.error('Init3DPayment failed', { correlationId, errorMessage, elapsedTime });
        throw new BadRequestException({
          message: errorMessage,
          correlationId,
          elapsedTime,
          soapRequestXml: debugRequestXml,
          soapResponseXml: rawXml,
        });
      }

      if (!mapped.continueUrl) {
        this.logger.warn('Init3DPayment: ContinueUrl yok — test ortamı yanıtı olabilir', {
          correlationId, elapsedTime, paymentId: mapped.paymentId,
        });
      }

      this.logger.log('Init3DPayment success', {
        correlationId,
        paymentId: mapped.paymentId,
        hasContinueUrl: !!mapped.continueUrl,
        elapsedTime,
      });

      return {
        success: true,
        message: '3D ödeme başlatıldı',
        correlationId,
        paymentId: mapped.paymentId,
        threeDSUrl: mapped.continueUrl,
        continueUrl: mapped.continueUrl,
        status: mapped.status,
        rawDetails: mapped.details,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      const elapsedTime = Date.now() - startTime;
      this.logger.error('Init3DPayment error', {
        correlationId,
        error: error instanceof Error ? error.message : String(error),
        elapsedTime,
      });
      throw new InternalServerErrorException({
        message: '3D ödeme başlatılırken bir hata oluştu. Lütfen tekrar deneyin.',
        correlationId,
        elapsedTime,
        soapRequestXml: debugRequestXml,
      });
    }
  }
}
