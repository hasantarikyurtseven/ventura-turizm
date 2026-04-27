import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AirSearchRequestDto } from '../../dto/air-search-request.dto';
import { BiletbankAuthService } from '../../auth/auth.service';
import { BiletbankConfigService } from '../../common/biletbank.config';
import { soapPost } from '../../common/soap.transport';
import { mapAirSearchXmlToFlights } from './airsearch.mapper';

@Injectable()
export class BiletbankAirSearchService {
  private readonly logger = new Logger(BiletbankAirSearchService.name);
  
  // Son AirSearch request ve response'ları sakla (debug için)
  private lastRequestXml: string | null = null;
  private lastResponseXml: string | null = null;
  private lastRequestParams: any = null;
  private lastResponse: any = null;

  constructor(
    private readonly auth: BiletbankAuthService,
    private readonly cfg: BiletbankConfigService,
  ) {}
  
  // Debug için son request/response'u getir
  getLastDebugInfo() {
    return {
      requestParams: this.lastRequestParams,
      requestXml: this.lastRequestXml,
      responseXml: this.lastResponseXml,
      response: this.lastResponse,
      timestamp: new Date().toISOString(),
    };
  }

  async airSearch(dto: AirSearchRequestDto): Promise<any> {
    try {
      const c = this.cfg.config;
      const loginResult = await this.auth.login();

      if (!loginResult.isValid || !loginResult.sessionToken || !loginResult.sessionId) {
        this.logger.error('AirSearch: Login failed', {
          isValid: loginResult.isValid,
          hasSessionToken: !!loginResult.sessionToken,
          hasSessionId: !!loginResult.sessionId,
        });
        throw new HttpException(
          'BiletBank oturumu açılamadı. Lütfen tekrar deneyin.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

    const toSoapDate = (d: string) => `${d}T00:00:00`;
    const departureSoap = toSoapDate(dto.departureDate);
    const returnSoap = dto.returnDate ? toSoapDate(dto.returnDate) : undefined;

    // Debug: IsCity değerlerini logla
    const requestParams = {
      tripType: dto.tripType,
      originCode: dto.originCode,
      originCountryCode: dto.originCountryCode,
      originIsCity: dto.originIsCity,
      destinationCode: dto.destinationCode,
      destinationCountryCode: dto.destinationCountryCode,
      destinationIsCity: dto.destinationIsCity,
      departureDate: dto.departureDate,
      returnDate: dto.returnDate,
      adults: dto.adults,
      children: dto.children,
      infants: dto.infants,
      searchReason: dto.searchReason,
    };
    this.logger.log('AirSearch request params', requestParams);
    this.lastRequestParams = requestParams;

    const paxItems = [
      `<trev2:T_AirSearch_PaxItem>
                     <trev2:PaxCode>ADT</trev2:PaxCode>
                     <trev2:PaxCount>${dto.adults}</trev2:PaxCount>
                  </trev2:T_AirSearch_PaxItem>`,
    ];
    if (dto.children && dto.children > 0) {
      paxItems.push(`<trev2:T_AirSearch_PaxItem>
                     <trev2:PaxCode>CHD</trev2:PaxCode>
                     <trev2:PaxCount>${dto.children}</trev2:PaxCount>
                  </trev2:T_AirSearch_PaxItem>`);
    }
    if (dto.infants && dto.infants > 0) {
      paxItems.push(`<trev2:T_AirSearch_PaxItem>
                     <trev2:PaxCode>INF</trev2:PaxCode>
                     <trev2:PaxCount>${dto.infants}</trev2:PaxCount>
                  </trev2:T_AirSearch_PaxItem>`);
    }

    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:trev="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base" xmlns:trev1="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping" xmlns:trev2="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Air" xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:AirSearch>
         <tem:request>
            <trev:EndUserInfo>
               <trev:EndUserBrowserAgent>DefaultBrowser</trev:EndUserBrowserAgent>
               <trev:EndUserIpAddress>127.0.0.1</trev:EndUserIpAddress>
               <trev:RequestOrigin>DefaultRequestOrigin</trev:RequestOrigin>
            </trev:EndUserInfo>
            <trev:AuthenticationHeader>
               <trev:SessionId>${loginResult.sessionId}</trev:SessionId>
               <trev:SessionToken>${loginResult.sessionToken}</trev:SessionToken>
            </trev:AuthenticationHeader>
            <trev:ExtraParamList>
               <trev:ExtendedData>
                  <trev:Name>BrandedFareVersion</trev:Name>
                  <trev:Type i:nil="true"/>
                  <trev:Value>v2</trev:Value>
               </trev:ExtendedData>
            </trev:ExtraParamList>
            <trev1:CreateNewShoppingFile>true</trev1:CreateNewShoppingFile>
            <trev1:Form>
               <trev2:CorporateFares i:nil="true"/>
               <trev2:FlightType>${dto.tripType}</trev2:FlightType>
               <trev2:IsStatelessRequest>false</trev2:IsStatelessRequest>
               <trev2:Options>
                  <trev2:CombinablePrice i:nil="true"/>
                  <trev2:FlightClass>Economy</trev2:FlightClass>
                  <trev2:FlightWithBaggage>false</trev2:FlightWithBaggage>
                  <trev2:IfDirectFlightsOnly>false</trev2:IfDirectFlightsOnly>
                  <trev2:IfRefundablesOnly>false</trev2:IfRefundablesOnly>
                  <trev2:PreferedAirlines i:nil="true" xmlns:b="http://schemas.microsoft.com/2003/10/Serialization/Arrays"/>
                  <trev2:SearchTimeoutMilliseconds>20000</trev2:SearchTimeoutMilliseconds>
               </trev2:Options>
               <trev2:PaxItems>
                  ${paxItems.join('\n                  ')}
               </trev2:PaxItems>
               <trev2:Segments>
                  <trev2:T_AirSearch_SegmentItem>
                     <trev2:DepartureDay>${departureSoap}</trev2:DepartureDay>
                     <trev2:Destination>
                        <trev2:Code>${dto.destinationCode}</trev2:Code>
                        <trev2:CountryCode>${dto.destinationCountryCode}</trev2:CountryCode>
                        <trev2:IsCity>${dto.destinationIsCity}</trev2:IsCity>
                        <trev2:Name/>
                     </trev2:Destination>
                     <trev2:Origin>
                        <trev2:Code>${dto.originCode}</trev2:Code>
                        <trev2:CountryCode>${dto.originCountryCode}</trev2:CountryCode>
                        <trev2:IsCity>${dto.originIsCity}</trev2:IsCity>
                        <trev2:Name/>
                     </trev2:Origin>
                     <trev2:SequenceNo>1</trev2:SequenceNo>
                  </trev2:T_AirSearch_SegmentItem>${returnSoap ? `
                  <trev2:T_AirSearch_SegmentItem>
                     <trev2:DepartureDay>${returnSoap}</trev2:DepartureDay>
                     <trev2:Destination>
                        <trev2:Code>${dto.originCode}</trev2:Code>
                        <trev2:CountryCode>${dto.originCountryCode}</trev2:CountryCode>
                        <trev2:IsCity>${dto.originIsCity}</trev2:IsCity>
                        <trev2:Name/>
                     </trev2:Destination>
                     <trev2:Origin>
                        <trev2:Code>${dto.destinationCode}</trev2:Code>
                        <trev2:CountryCode>${dto.destinationCountryCode}</trev2:CountryCode>
                        <trev2:IsCity>${dto.destinationIsCity}</trev2:IsCity>
                        <trev2:Name/>
                     </trev2:Origin>
                     <trev2:SequenceNo>2</trev2:SequenceNo>
                  </trev2:T_AirSearch_SegmentItem>` : ''}
               </trev2:Segments>
            </trev1:Form>
         </tem:request>
      </tem:AirSearch>
   </soapenv:Body>
</soapenv:Envelope>`;

    // Debug: Request XML'i sakla ve logla (BiletBank için)
    this.lastRequestXml = xml;
    this.logger.log('=== AirSearch REQUEST XML ===');
    this.logger.log(xml);
    this.logger.log('=== END REQUEST XML ===');

    let rawXml: string = '';
    try {
      const result = await soapPost({
        url: c.apiUrl,
        clientKey: c.clientKey,
        soapAction: 'http://tempuri.org/I_Shopping/AirSearch',
        xml,
        timeoutMs: 30000,
      });
      rawXml = result?.rawXml || String(result?.rawXml || '');
      this.logger.log('SOAP Post result:', { 
        hasRawXml: !!result?.rawXml, 
        rawXmlType: typeof result?.rawXml,
        rawXmlLength: rawXml?.length || 0 
      });
    } catch (error: any) {
      // Hata durumunda da response'u sakla (eğer varsa)
      rawXml = error?.response?.data || error?.response?.data?.toString() || error?.message || 'Error: No response received';
      this.logger.error('AirSearch SOAP error', {
        message: error?.message,
        response: error?.response?.data ? String(error.response.data).substring(0, 500) : 'No response data',
        stack: error?.stack,
      });
    }

    // Debug: Response XML'i sakla ve logla (BiletBank için)
    // rawXml'i string'e çevir (her durumda)
    const responseXmlString = rawXml ? String(rawXml) : '';
    
    // Her durumda response'u sakla (boş bile olsa)
    // ÖNEMLİ: Bu satır mutlaka çalışmalı, her durumda bir değer atanmalı
    this.lastResponseXml = responseXmlString || 'No response received';
    
    // Debug: Service instance'ını ve değişkeni kontrol et
    this.logger.log('=== AirSearch RESPONSE XML ===');
    this.logger.log('rawXml type:', typeof rawXml, 'length:', rawXml?.length || 0);
    this.logger.log('responseXmlString:', responseXmlString?.substring(0, 200) || 'EMPTY');
    this.logger.log('lastResponseXml BEFORE:', this.lastResponseXml?.substring(0, 200) || 'NULL');
    this.logger.log('=== END RESPONSE XML ===');
    this.logger.log('Response XML saved, length:', responseXmlString?.length || 0);
    this.logger.log('lastResponseXml AFTER set:', !!this.lastResponseXml, 'length:', this.lastResponseXml?.length || 0);
    this.logger.log('lastResponseXml value preview:', this.lastResponseXml?.substring(0, 200) || 'EMPTY');

    const mapped = mapAirSearchXmlToFlights(rawXml);

    // Debug: Response'u logla
    this.logger.log('AirSearch response', {
      hasError: mapped.hasError,
      searchId: mapped.searchId,
      shoppingFileId: mapped.shoppingFileId,
      flightsCount: mapped.flights?.length || 0,
      firstFlight: mapped.flights?.[0] ? {
        id: mapped.flights[0].id,
        airline: mapped.flights[0].airline,
        price: mapped.flights[0].price,
      } : null,
    });

    const response = {
      success: true,
      message: 'AirSearch completed',
      hasError: mapped.hasError,
      searchId: mapped.searchId,
      shoppingFileId: mapped.shoppingFileId,
      // Session bilgileri - Allocate ve diğer booking adımları için gerekli
      sessionId: loginResult.sessionId,
      sessionToken: loginResult.sessionToken,
      flights: mapped.flights,
    };
    
    // Debug: Response'u sakla
    this.lastResponse = response;
    
    return response;
    } catch (error: any) {
      // Hata durumunda da response'u sakla (debug için)
      this.lastResponse = {
        success: false,
        message: error?.message || 'Bilinmeyen hata',
        hasError: true,
      };
      
      // Zaten HttpException ise tekrar fırlat
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Diğer hatalar için HttpException'a çevir
      this.logger.error('AirSearch service error', {
        error: error?.message,
        stack: error?.stack,
        dto: dto,
      });
      
      throw new HttpException(
        {
          success: false,
          message: error?.message || 'Uçuş arama sırasında bir hata oluştu.',
          error: 'AirSearch Service Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
