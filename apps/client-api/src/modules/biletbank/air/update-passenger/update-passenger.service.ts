import {
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  UpdatePassengerRequestDto,
  UpdatePassengerItemDto,
} from '../../dto/update-passenger-request.dto';
import { BiletbankConfigService } from '../../common/biletbank.config';
import { soapPost } from '../../common/soap.transport';
import { mapUpdatePassengerXmlToResponse } from './update-passenger.mapper';
import { randomUUID } from 'crypto';

function maskSessionId(sessionId?: string): string {
  if (!sessionId || sessionId.length < 4) return 'SESS-***';
  return `SESS-${sessionId.substring(0, 2)}***${sessionId.substring(sessionId.length - 2)}`;
}

function maskSessionToken(token?: string): string {
  if (!token || token.length < 4) return 'TOK-***';
  return `TOK-${token.substring(0, 2)}***${token.substring(token.length - 2)}`;
}

/** FirstName'den boşlukları kaldırır (BiletBank kuralı) */
function sanitizeFirstName(name: string): string {
  return (name || '').replace(/\s+/g, '').trim().toUpperCase() || 'PASSENGER';
}

/** XML escape */
function escapeXml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function normalizeGuidLike(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const normalized = String(value).trim();
  return normalized.length > 0 && normalized !== '[object Object]' ? normalized : undefined;
}

function buildPassengerXml(p: UpdatePassengerItemDto, useMinimalDomesticShape: boolean): string {
  const firstName = sanitizeFirstName(p.firstName);
  const lastName = (p.lastName || '').trim().toUpperCase() || 'PASSENGER';
  const wheelChair = p.wheelChairServiceType ?? 0;
  const citizenNo = useMinimalDomesticShape ? '00000000000' : p.citizenNo;

  // Tek ürün + yerli TC akışında support örneğindeki minimal shape'i birebir kullan.
  const isDomesticTc = p.citizenNo && p.citizenNo !== '00000000000';
  const optionalIdentityXml = isDomesticTc
    ? (useMinimalDomesticShape
        ? ''
        : `
              <trev2:Nationality>${escapeXml(p.nationality)}</trev2:Nationality>
              <trev2:PassportCountry/>
              <trev2:PassportNo/>
              <trev2:PassportValidDate/>`)
    : `
              <trev2:Nationality>${escapeXml(p.nationality)}</trev2:Nationality>
              <trev2:PassportCountry>${escapeXml(p.passportCountry)}</trev2:PassportCountry>
              <trev2:PassportNo>${escapeXml(p.passportNo)}</trev2:PassportNo>
              ${p.passportValidDate
                ? `<trev2:PassportValidDate>${escapeXml(p.passportValidDate)}</trev2:PassportValidDate>`
                : ''}`;

  return `
            <trev2:T_Passenger>
              <trev2:BirthDate>${escapeXml(p.birthDate)}</trev2:BirthDate>
              <trev2:CitizenNo>${escapeXml(citizenNo)}</trev2:CitizenNo>
              <trev2:Email>${escapeXml(p.email)}</trev2:Email>
              <trev2:FirstName>${escapeXml(firstName)}</trev2:FirstName>
              <trev2:Gender>${escapeXml(p.gender)}</trev2:Gender>
              <trev2:Id>${escapeXml(p.id)}</trev2:Id>
              <trev2:IfContact>${p.ifContact ? 'true' : 'false'}</trev2:IfContact>
              <trev2:LastName>${escapeXml(lastName)}</trev2:LastName>
              ${optionalIdentityXml}
              <trev2:Phone>${escapeXml(p.phone)}</trev2:Phone>
              <trev2:SequenceNo>${p.sequenceNo}</trev2:SequenceNo>
              <trev2:TempTag>${escapeXml(p.tempTag)}</trev2:TempTag>
              <trev2:Type>${escapeXml(p.type)}</trev2:Type>
              <trev2:WheelChairServiceType>${wheelChair}</trev2:WheelChairServiceType>
            </trev2:T_Passenger>`;
}

@Injectable()
export class BiletbankUpdatePassengerService {
  private readonly logger = new Logger(BiletbankUpdatePassengerService.name);

  constructor(private readonly cfg: BiletbankConfigService) {}

  async updatePassengers(dto: UpdatePassengerRequestDto): Promise<any> {
    const startTime = Date.now();
    const correlationId = randomUUID();
    const c = this.cfg.config;

    if (!dto.sessionId || !dto.sessionToken) {
      this.logger.warn('UpdatePassenger validation failed: Session missing', {
        correlationId,
        hasSessionId: !!dto.sessionId,
        hasSessionToken: !!dto.sessionToken,
      });
      throw new BadRequestException(
        'Session bilgileri eksik. Lütfen önce uçuş araması yapın.',
      );
    }

    if (!dto.productIds?.length) {
      this.logger.warn('UpdatePassenger validation failed: ProductIds empty', {
        correlationId,
      });
      throw new BadRequestException('En az bir ProductId gereklidir.');
    }

    if (!dto.newPassengers?.length) {
      this.logger.warn('UpdatePassenger validation failed: No passengers', {
        correlationId,
      });
      throw new BadRequestException('En az bir yolcu bilgisi gereklidir.');
    }

    this.logger.log('UpdatePassenger started', {
      correlationId,
      sessionId: maskSessionId(dto.sessionId),
      productIds: dto.productIds,
      passengerCount: dto.newPassengers.length,
    });

    // BiletBank: ProductIds = arr:guid, değer = Allocate ProductId = AirSearch ProductId
    const productIdsXml = dto.productIds
      .map((id) => `<arr:guid>${escapeXml(id.trim())}</arr:guid>`)
      .join('\n                    ');

    const buildRequestXml = (passengers: UpdatePassengerItemDto[]): string => {
      const useMinimalDomesticShape =
        passengers.length === 1 &&
        dto.productIds.length === 1 &&
        passengers.every((p) => p.citizenNo && p.citizenNo !== '00000000000');

      const normalizedPassengers = useMinimalDomesticShape
        ? passengers.map((p) => ({
            ...p,
            // Support örneği: tek ürünlü akışta Id = ProductId. TempTag Allocate'ten gelir.
            id: dto.productIds[0].trim(),
          }))
        : passengers;

      const passengersXml = normalizedPassengers
        .map((p) => buildPassengerXml(p, useMinimalDomesticShape))
        .join('');

      if (useMinimalDomesticShape) {
        return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:trev="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base" xmlns:trev1="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping" xmlns:trev2="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Shopping" xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:UpdatePassengers>
         <tem:request>
            <trev:AuthenticationHeader>
               <trev:SessionId>${escapeXml(dto.sessionId)}</trev:SessionId>
               <trev:SessionToken>${escapeXml(dto.sessionToken)}</trev:SessionToken>
            </trev:AuthenticationHeader>
            <trev1:Form>
               <trev1:ModifiedPassengers/>
               <trev1:NewPassengers>${passengersXml}
               </trev1:NewPassengers>
               <trev1:ProductIds>
                  ${productIdsXml}
               </trev1:ProductIds>
            </trev1:Form>
         </tem:request>
      </tem:UpdatePassengers>
   </soapenv:Body>
</soapenv:Envelope>`;
      }

      return `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tem="http://tempuri.org/"
  xmlns:trev="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base"
  xmlns:trev1="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping"
  xmlns:trev2="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Shopping"
  xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays"
  xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <soapenv:Header/>
  <soapenv:Body>
    <tem:UpdatePassengers>
      <tem:request>
        <trev:AuthenticationHeader>
          <trev:SessionId>${escapeXml(dto.sessionId)}</trev:SessionId>
          <trev:SessionToken>${escapeXml(dto.sessionToken)}</trev:SessionToken>
        </trev:AuthenticationHeader>
        <trev1:Form>
          <trev1:ModifiedPassengers i:nil="true"/>
          <trev1:NewPassengers>
            ${passengersXml}
          </trev1:NewPassengers>
          <trev1:ProductIds>
            ${productIdsXml}
          </trev1:ProductIds>
        </trev1:Form>
      </tem:request>
    </tem:UpdatePassengers>
  </soapenv:Body>
</soapenv:Envelope>`;
    };

    const xml = buildRequestXml(dto.newPassengers);

    try {
      const { rawXml } = await soapPost({
        url: c.apiUrl,
        clientKey: c.clientKey,
        soapAction: 'http://tempuri.org/I_Shopping/UpdatePassengers',
        xml,
        timeoutMs: 30000,
      });

      const elapsedTime = Date.now() - startTime;
      const mapped = mapUpdatePassengerXmlToResponse(rawXml);
      const sf = mapped.details?.ShoppingFile as any;
      const airBookingsNode = sf?.AirBookings;
      const airBookings = Array.isArray(airBookingsNode?.T_AirBooking)
        ? airBookingsNode.T_AirBooking
        : airBookingsNode?.T_AirBooking
          ? [airBookingsNode.T_AirBooking]
          : [];
      const responseLocalSeqNos = airBookings.flatMap((b: any) => {
        const items = b?.BookingItems?.T_AirBookingItem;
        const itemList = Array.isArray(items) ? items : items ? [items] : [];
        return itemList.flatMap((it: any) => {
          const refs = it?.PaxReference;
          const refList = Array.isArray(refs) ? refs : refs ? [refs] : [];
          return refList.map((r: any) => r?.LocalSequenceNo).filter((x: unknown) => x !== undefined && x !== null);
        });
      });

      if (mapped.hasError) {
        const errorMessage =
          mapped.errorMessage || 'Yolcu bilgileri güncellenemedi.';

        const lowerMsg = errorMessage.toLowerCase();
        const isSessionExpired =
          lowerMsg.includes('session') ||
          lowerMsg.includes('unauthorized') ||
          lowerMsg.includes('invalid session');
        const isBasketInvalid =
          lowerMsg.includes('basket code') || lowerMsg.includes('same basket');

        if (isSessionExpired) {
          this.logger.warn('UpdatePassenger failed: Session invalid/expired', {
            correlationId,
            errorMessage,
            elapsedTime,
            sessionId: maskSessionId(dto.sessionId),
          });
          throw new UnauthorizedException(
            'Oturum süresi dolmuş. Lütfen yeniden arama yapın.',
          );
        }

        if (isBasketInvalid) {
          this.logger.warn('UpdatePassenger failed: Basket/session invalid', {
            correlationId,
            errorMessage,
            elapsedTime,
            sessionId: maskSessionId(dto.sessionId),
          });
          throw new BadRequestException(
            'Bu rezervasyon oturumu artık geçersiz. Lütfen anasayfadan yeni bir uçuş araması yapıp tekrar deneyin.',
          );
        }

        const isSequenceMismatch = lowerMsg.includes('sequence contains no matching element');
        if (isSequenceMismatch && responseLocalSeqNos.length > 0) {
          const seqToRef = new Map<number, { passengerId?: string; paxReferenceId?: string }>();
          for (const b of airBookings) {
            const items = b?.BookingItems?.T_AirBookingItem;
            const itemList = Array.isArray(items) ? items : items ? [items] : [];
            for (const it of itemList) {
              const refs = it?.PaxReference;
              const refList = Array.isArray(refs) ? refs : refs ? [refs] : [];
              for (const r of refList) {
                const seq = Number(r?.LocalSequenceNo);
                if (!Number.isNaN(seq) && seq > 0) {
                  seqToRef.set(seq, {
                    passengerId: normalizeGuidLike(r?.PassengerId),
                    paxReferenceId: normalizeGuidLike(r?.PaxReferenceId),
                  });
                }
              }
            }
          }

          const retriedPassengers = dto.newPassengers.map((p) => {
            const ref = seqToRef.get(Number(p.sequenceNo));
            return {
              ...p,
              id: ref?.passengerId || p.id,
              tempTag: ref?.paxReferenceId || ref?.passengerId || p.tempTag,
            };
          });

          const anyChanged = retriedPassengers.some((p, idx) => p.id !== dto.newPassengers[idx].id || p.tempTag !== dto.newPassengers[idx].tempTag);
          if (anyChanged) {
            const retryXml = buildRequestXml(retriedPassengers);
            const retry = await soapPost({
              url: c.apiUrl,
              clientKey: c.clientKey,
              soapAction: 'http://tempuri.org/I_Shopping/UpdatePassengers',
              xml: retryXml,
              timeoutMs: 30000,
            });
            const retryMapped = mapUpdatePassengerXmlToResponse(retry.rawXml);
            if (!retryMapped.hasError) {
              this.logger.log('UpdatePassenger success (retry)', {
                correlationId,
                passengerCount: retriedPassengers.length,
              });
              return {
                success: true,
                message: 'Yolcu bilgileri başarıyla güncellendi',
                shoppingFileId: retryMapped.shoppingFileId,
                details: retryMapped.details,
                correlationId,
              };
            }
          }
        }

        this.logger.error('UpdatePassenger failed', {
          correlationId,
          errorMessage,
          elapsedTime,
          sessionId: maskSessionId(dto.sessionId),
          sessionToken: maskSessionToken(dto.sessionToken),
        });
        throw new BadRequestException(errorMessage);
      }

      this.logger.log('UpdatePassenger success', {
        correlationId,
        passengerCount: dto.newPassengers.length,
        elapsedTime,
      });

      return {
        success: true,
        message: 'Yolcu bilgileri başarıyla güncellendi',
        shoppingFileId: mapped.shoppingFileId,
        details: mapped.details,
        correlationId,
      };
    } catch (error) {
      const elapsedTime = Date.now() - startTime;

      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      this.logger.error('UpdatePassenger error', {
        correlationId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        elapsedTime,
        sessionId: maskSessionId(dto.sessionId),
        sessionToken: maskSessionToken(dto.sessionToken),
      });

      throw new InternalServerErrorException(
        'Yolcu bilgileri güncellenirken bir hata oluştu. Lütfen tekrar deneyin.',
      );
    }
  }
}
