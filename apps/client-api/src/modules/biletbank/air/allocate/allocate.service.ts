import { Injectable, Logger, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AllocateRequestDto } from '../../dto/allocate-request.dto';
import { BiletbankConfigService } from '../../common/biletbank.config';
import { soapPost } from '../../common/soap.transport';
import { mapAllocateXmlToResponse } from './allocate.mapper';
import { randomUUID } from 'crypto';

/**
 * Session bilgilerini maskeler (güvenlik için)
 */
function maskSessionId(sessionId?: string): string {
  if (!sessionId || sessionId.length < 4) return 'SESS-***';
  return `SESS-${sessionId.substring(0, 2)}***${sessionId.substring(sessionId.length - 2)}`;
}

function maskSessionToken(token?: string): string {
  if (!token || token.length < 4) return 'TOK-***';
  return `TOK-${token.substring(0, 2)}***${token.substring(token.length - 2)}`;
}

@Injectable()
export class BiletbankAllocateService {
  private readonly logger = new Logger(BiletbankAllocateService.name);

  constructor(private readonly cfg: BiletbankConfigService) {}

  async allocate(dto: AllocateRequestDto): Promise<any> {
    const startTime = Date.now();
    const correlationId = randomUUID();
    const c = this.cfg.config;

    // ===== 5) VALIDATION KURALLARI (Request göndermeden önce) =====
    
    // 5.1 Session kontrolleri
    if (!dto.sessionId || !dto.sessionToken) {
      this.logger.warn('Allocate validation failed: Session missing', {
        correlationId,
        hasSessionId: !!dto.sessionId,
        hasSessionToken: !!dto.sessionToken,
      });
      throw new BadRequestException(
        'Session bilgileri eksik. Lütfen önce uçuş araması yapın.',
      );
    }

    // 5.2 Product kontrolleri
    if (!dto.productId || typeof dto.productId !== 'string' || dto.productId.trim().length === 0) {
      this.logger.warn('Allocate validation failed: ProductId missing or invalid', {
        correlationId,
        productId: dto.productId,
      });
      throw new BadRequestException('ProductId gereklidir ve geçerli olmalıdır.');
    }

    // 5.3 Amount kontrolleri
    const amount = dto.selectedServiceFeeAmount ?? 0;
    if (amount < 0) {
      this.logger.warn('Allocate validation failed: Amount is negative', {
        correlationId,
        amount,
        productId: dto.productId,
      });
      throw new BadRequestException('SelectedServiceFeeAmount negatif olamaz.');
    }

    // Log: Allocate started (INFO seviyesi)
    this.logger.log('Allocate started', {
      correlationId,
      sessionId: maskSessionId(dto.sessionId),
      sessionToken: maskSessionToken(dto.sessionToken),
      productId: dto.productId,
      brandedFareItemId: dto.brandedFareItemId || '(none)',
      amount,
    });

    // ===== SOAP REQUEST OLUŞTURMA =====
    // Amount format: 2 hane kuralı (decimal string olarak gönderilebilir, ama number da kabul edilir)
    const amountFormatted = Number(amount).toFixed(2);

    // BiletBank dokümantasyonundaki örnek yapıya göre XML oluştur
    // Dokümantasyonda EndUserInfo yok, sadece AuthenticationHeader ve Form var
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tem="http://tempuri.org/"
  xmlns:i="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:base="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base"
  xmlns:io="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping">
  <soapenv:Header/>
  <soapenv:Body>
    <tem:Allocate>
      <tem:request>
        <base:AuthenticationHeader>
          <base:SessionId>${dto.sessionId}</base:SessionId>
          <base:SessionToken>${dto.sessionToken}</base:SessionToken>
        </base:AuthenticationHeader>
        <io:Form>
          <io:SelectedItems>
            <io:IO_AllocationItem>
              ${dto.brandedFareItemId ? `<io:BrandedFareItemId>${dto.brandedFareItemId.trim()}</io:BrandedFareItemId>` : ''}
              <io:ProductId>${dto.productId.trim()}</io:ProductId>
              <io:SelectedServiceFee>
                <io:Amount>${amountFormatted}</io:Amount>
              </io:SelectedServiceFee>
            </io:IO_AllocationItem>
          </io:SelectedItems>
        </io:Form>
      </tem:request>
    </tem:Allocate>
  </soapenv:Body>
</soapenv:Envelope>`;

    try {
      // ===== 6) HTTP/SOAP İSTEMCİ KURALLARI =====
      // 6.1 Timeout: 30 saniye (20-40 sn arası kuralına uygun)
      const { rawXml } = await soapPost({
        url: c.apiUrl,
        clientKey: c.clientKey,
        soapAction: 'http://tempuri.org/I_Shopping/Allocate',
        xml,
        timeoutMs: 30000, // 30 saniye
      });

      const elapsedTime = Date.now() - startTime;
      const mapped = mapAllocateXmlToResponse(rawXml);

      // ===== 7) HATA YÖNETİMİ (Eksiksiz) =====
      if (mapped.hasError) {
        const errorMessage = mapped.errorMessage || 'Koltuk tahsisi yapılamadı.';
        
        // 7.1 Kimlik doğrulama hataları
        if (errorMessage.toLowerCase().includes('session') || 
            errorMessage.toLowerCase().includes('unauthorized') ||
            errorMessage.toLowerCase().includes('invalid session')) {
          this.logger.warn('Allocate failed: Session invalid/expired', {
            correlationId,
            errorMessage,
            productId: dto.productId,
            elapsedTime,
            sessionId: maskSessionId(dto.sessionId),
          });
          throw new UnauthorizedException('Oturum süresi dolmuş. Lütfen yeniden arama yapın.');
        }

        // 7.2 Ürün uygun değil / stok bitti
        if (errorMessage.toLowerCase().includes('not found') ||
            errorMessage.toLowerCase().includes('allocated product') ||
            errorMessage.toLowerCase().includes('product') && errorMessage.toLowerCase().includes('available')) {
          this.logger.warn('Allocate failed: Product not available', {
            correlationId,
            errorMessage,
            productId: dto.productId,
            elapsedTime,
          });
          throw new BadRequestException('Seçilen uçuş artık mevcut değil. Lütfen yeni bir arama yapın.');
        }

        // 7.3 Validasyon hatası (BiletBank tarafından)
        this.logger.error('Allocate failed', {
          correlationId,
          errorMessage,
          productId: dto.productId,
          amount,
          elapsedTime,
          sessionId: maskSessionId(dto.sessionId),
          sessionToken: maskSessionToken(dto.sessionToken),
        });
        throw new BadRequestException(errorMessage);
      }

      // ===== BAŞARILI RESPONSE =====
      const elapsedTimeSuccess = Date.now() - startTime;
      this.logger.log('Allocate success', {
        correlationId,
        productId: dto.productId,
        allocateId: mapped.allocateId,
        allocateProductId: mapped.productId,
        paxReferences: mapped.paxReferences,
        amount,
        elapsedTime: elapsedTimeSuccess,
      });

      return {
        success: true,
        message: 'Koltuk tahsisi başarılı',
        allocateId: mapped.allocateId,
        productId: mapped.productId,
        shoppingFileId: mapped.shoppingFileId,
        paxReferences: mapped.paxReferences,
        details: mapped.details,
        correlationId,
      };
    } catch (error) {
      const elapsedTime = Date.now() - startTime;
      
      // Zaten fırlatılmış exception'ları tekrar fırlatma
      if (error instanceof BadRequestException || 
          error instanceof UnauthorizedException) {
        throw error;
      }

      // 7.4 Sunucu hataları / 5xx veya network hataları
      // 7.5 Beklenmeyen response
      this.logger.error('Allocate error', {
        correlationId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        productId: dto.productId,
        amount,
        elapsedTime,
        sessionId: maskSessionId(dto.sessionId),
        sessionToken: maskSessionToken(dto.sessionToken),
      });

      throw new InternalServerErrorException(
        'Koltuk tahsisi sırasında bir hata oluştu. Lütfen tekrar deneyin.',
      );
    }
  }
}
