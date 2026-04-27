import { Body, Controller, Get, Header, Post, Res, UseGuards, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { AirSearchRequestDto } from '../../dto/air-search-request.dto';
import { BiletbankAirSearchService } from './airsearch.service';
import { BookingAuthGuard } from '../../guards/booking-auth.guard';

@Controller('biletbank')
export class BiletbankAirSearchController {
  private readonly logger = new Logger(BiletbankAirSearchController.name);

  constructor(private readonly airSearchService: BiletbankAirSearchService) {}

  @Post('airsearch')
  // @UseGuards(BookingAuthGuard) // Geçici olarak devre dışı - CORS hatası nedeniyle
  async airSearch(@Body() body: AirSearchRequestDto) {
    // Geçici olarak auth kontrolü kaldırıldı
    // TODO: CORS düzeltildikten sonra guard'ı tekrar aktif et
    try {
      this.logger.log('AirSearch request received', {
        origin: body.originCode,
        destination: body.destinationCode,
        departureDate: body.departureDate,
        searchReason: body.searchReason,
      });
      
      const result = await this.airSearchService.airSearch(body);
      
      this.logger.log('AirSearch request completed successfully', {
        hasError: result.hasError,
        flightsCount: result.flights?.length || 0,
      });
      
      return result;
    } catch (error: any) {
      this.logger.error('AirSearch request failed', {
        error: error?.message,
        stack: error?.stack,
        body: body,
      });
      
      // Hata durumunda da response gönder (ERR_EMPTY_RESPONSE'u önlemek için)
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          message: error?.message || 'Uçuş arama sırasında bir hata oluştu.',
          error: 'AirSearch Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('airsearch/debug')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getDebugInfo(@Res() res: Response) {
    const debugInfo = this.airSearchService.getLastDebugInfo();

    // Response XML'i kontrol et ve düzelt
    // Eğer null veya undefined ise boş string yap
    let responseXml = 'N/A - Henüz response alınmamış. Lütfen önce bir AirSearch isteği yapın.';
    if (debugInfo.responseXml !== null && debugInfo.responseXml !== undefined) {
      responseXml = String(debugInfo.responseXml);
      if (responseXml === 'null' || responseXml === 'undefined' || responseXml.trim() === '') {
        responseXml = 'N/A - Response boş veya geçersiz.';
      }
    }
    
    let requestXml = 'N/A - Henüz request yapılmamış.';
    if (debugInfo.requestXml !== null && debugInfo.requestXml !== undefined) {
      requestXml = String(debugInfo.requestXml);
      if (requestXml === 'null' || requestXml === 'undefined' || requestXml.trim() === '') {
        requestXml = 'N/A - Request boş veya geçersiz.';
      }
    }
    
    const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BiletBank AirSearch Debug - Request & Response XML</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
      padding: 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header p {
      opacity: 0.9;
      font-size: 14px;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin-bottom: 40px;
    }
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #667eea;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-title::before {
      content: '';
      width: 4px;
      height: 20px;
      background: #667eea;
      border-radius: 2px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    .info-item {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #667eea;
    }
    .info-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
      font-weight: 600;
    }
    .info-value {
      font-size: 16px;
      color: #333;
      word-break: break-word;
    }
    .xml-container {
      background: #1e1e1e;
      border-radius: 6px;
      padding: 20px;
      overflow-x: auto;
      position: relative;
    }
    .xml-container pre {
      color: #d4d4d4;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.5;
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .copy-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: background 0.2s;
    }
    .copy-btn:hover {
      background: #5568d3;
    }
    .copy-btn:active {
      background: #4456c2;
    }
    .timestamp {
      color: #999;
      font-size: 12px;
      margin-top: 10px;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
    }
    .empty-state-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔍 BiletBank AirSearch Debug</h1>
      <p>Request ve Response XML'leri - BiletBank'a Mail İçin</p>
    </div>
    <div class="content">
      ${!debugInfo.requestXml ? `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <h2>Henüz AirSearch isteği yapılmamış</h2>
        <p>Lütfen önce bir uçuş araması yapın, sonra bu sayfayı yenileyin.</p>
      </div>
      ` : `
      <!-- Request Parameters -->
      <div class="section">
        <h2 class="section-title">📋 Request Parameters</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Trip Type</div>
            <div class="info-value">${debugInfo.requestParams?.tripType || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Origin</div>
            <div class="info-value">${debugInfo.requestParams?.originCode || 'N/A'} (IsCity: ${debugInfo.requestParams?.originIsCity ? 'true' : 'false'})</div>
          </div>
          <div class="info-item">
            <div class="info-label">Destination</div>
            <div class="info-value">${debugInfo.requestParams?.destinationCode || 'N/A'} (IsCity: ${debugInfo.requestParams?.destinationIsCity ? 'true' : 'false'})</div>
          </div>
          <div class="info-item">
            <div class="info-label">Departure Date</div>
            <div class="info-value">${debugInfo.requestParams?.departureDate || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Return Date</div>
            <div class="info-value">${debugInfo.requestParams?.returnDate || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Passengers</div>
            <div class="info-value">Adults: ${debugInfo.requestParams?.adults || 0}, Children: ${debugInfo.requestParams?.children || 0}, Infants: ${debugInfo.requestParams?.infants || 0}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Search Reason</div>
            <div class="info-value">${debugInfo.requestParams?.searchReason || 'N/A'}</div>
          </div>
        </div>
      </div>

      <!-- Request XML -->
      <div class="section">
        <h2 class="section-title">📤 REQUEST XML</h2>
        <div class="xml-container">
          <button class="copy-btn" onclick="copyToClipboard('request-xml')">📋 Kopyala</button>
          <pre id="request-xml">${this.escapeHtml(requestXml || 'N/A')}</pre>
        </div>
        <div class="timestamp">Oluşturulma: ${debugInfo.timestamp || 'N/A'} | Length: ${requestXml.length}</div>
      </div>

      <!-- Response XML -->
      <div class="section">
        <h2 class="section-title">📥 RESPONSE XML</h2>
        <div class="xml-container">
          <button class="copy-btn" onclick="copyToClipboard('response-xml')">📋 Kopyala</button>
          <pre id="response-xml">${this.escapeHtml(responseXml || 'N/A')}</pre>
        </div>
        <div class="timestamp">Alınma: ${debugInfo.timestamp || 'N/A'} | Length: ${responseXml.length}</div>
      </div>

      <!-- Response Summary -->
      ${debugInfo.response ? `
      <div class="section">
        <h2 class="section-title">📊 Response Summary</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Success</div>
            <div class="info-value">${debugInfo.response.success ? '✅ Yes' : '❌ No'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Has Error</div>
            <div class="info-value">${debugInfo.response.hasError ? '❌ Yes' : '✅ No'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Search ID</div>
            <div class="info-value">${debugInfo.response.searchId || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Shopping File ID</div>
            <div class="info-value">${debugInfo.response.shoppingFileId || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Flights Count</div>
            <div class="info-value">${debugInfo.response.flights?.length || 0}</div>
          </div>
        </div>
      </div>
      ` : ''}
      `}
    </div>
  </div>

  <script>
    function copyToClipboard(elementId) {
      const element = document.getElementById(elementId);
      const text = element.textContent;
      
      navigator.clipboard.writeText(text).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Kopyalandı!';
        btn.style.background = '#10b981';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '#667eea';
        }, 2000);
      }).catch(() => {
        alert('Kopyalama başarısız. Lütfen manuel olarak seçip kopyalayın.');
      });
    }
  </script>
</body>
</html>`;
    
    res.send(html);
  }
  
  private escapeHtml(text: string): string {
    if (!text) return 'N/A';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

