import { XMLParser } from 'fast-xml-parser';

export interface MakePrebookingPaxRef {
  localSequenceNo?: number;
  passengerId?: string;
  paxReferenceId?: string;
  localPaxType?: string;
  age?: number;
}

export interface MakePrebookingAirBooking {
  productId?: string;
  bookingCode?: string;
  status?: string;
  totalFare?: number;
  baseFare?: number;
  taxes?: number;
  serviceFee?: number;
  currency?: string;
  isRefundable?: boolean;
  canBeReserved?: boolean;
  prebookingExpiresAt?: string;
  reservationExpiresAt?: string;
  reservationDate?: string;
  paxReferences?: MakePrebookingPaxRef[];
}

export interface MakePrebookingResponse {
  hasError?: boolean;
  errorMessage?: string;
  isUnknownSystemError?: boolean;
  shoppingFileId?: string;
  ifFinalized?: boolean;
  isPriceChanged?: boolean;
  isFlightInfoChanged?: boolean;
  isReservationCancelled?: boolean;
  isCcPaymentEnabled?: boolean;
  isRaPaymentEnabled?: boolean;
  remainingSum?: number;
  maxSc?: number;
  minSc?: number;
  airBookings?: MakePrebookingAirBooking[];
  details?: any;
}

// fast-xml-parser, i:nil="true" attribute'li boş elementleri
// { nil: true } veya { 'i:nil': 'true' } şeklinde object döndürür.
function isXmlNil(val: unknown): boolean {
  if (typeof val !== 'object' || val === null) return false;
  const o = val as Record<string, unknown>;
  return (
    o['nil'] === true ||
    o['nil'] === 'true' ||
    o['i:nil'] === 'true' ||
    o['xsi:nil'] === 'true'
  );
}

function parseBool(val: unknown): boolean | undefined {
  if (val === undefined || val === null) return undefined;
  if (isXmlNil(val)) return undefined;
  if (typeof val === 'boolean') return val;
  const s = String(val).toLowerCase().trim();
  if (s === 'true') return true;
  if (s === 'false') return false;
  return undefined;
}

function parseNum(val: unknown): number | undefined {
  if (val === undefined || val === null) return undefined;
  if (isXmlNil(val)) return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}

function parseStr(val: unknown): string | undefined {
  if (val === undefined || val === null) return undefined;
  if (isXmlNil(val)) return undefined;
  const s = String(val).trim();
  return s.length > 0 && s !== 'null' ? s : undefined;
}

export function mapMakePrebookingXmlToResponse(rawXml: string): MakePrebookingResponse {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    removeNSPrefix: true,
    parseTagValue: true,
    parseAttributeValue: true,
    trimValues: true,
  });

  const doc: any = parser.parse(rawXml);
  const result =
    doc?.Envelope?.Body?.MakePrebookingResponse?.MakePrebookingResult ??
    doc?.Body?.MakePrebookingResponse?.MakePrebookingResult ??
    doc?.MakePrebookingResponse?.MakePrebookingResult;

  const hasError = parseBool(result?.HasError) ?? false;
  const errorMessage =
    parseStr(result?.ServiceError?.ErrorMessage) ??
    parseStr(result?.ServiceError?.DebugMessage);
  const isUnknownSystemError =
    parseBool(result?.ServiceError?.TypeFlags?.IsUnknownError) ?? false;

  const sf = result?.ShoppingFile;

  const shoppingFileId = parseStr(sf?.Id);
  const ifFinalized = parseBool(sf?.IfFinalized);
  const isPriceChanged = parseBool(sf?.IsPriceChanged);
  const isFlightInfoChanged = parseBool(sf?.IsFlightInfoChanged);
  const isReservationCancelled = parseBool(sf?.IsReservationCancelled);
  const isCcPaymentEnabled = parseBool(sf?.Is_CC_Payment_Enabled);
  const isRaPaymentEnabled = parseBool(sf?.Is_RA_Payment_Enabled);
  const remainingSum = parseNum(sf?.RemainingSum);
  const maxSc = parseNum(sf?.MaxSc);
  const minSc = parseNum(sf?.MinSc);

  // AirBookings parse
  const airBookings: MakePrebookingAirBooking[] = [];
  const bookingNode = sf?.AirBookings?.T_AirBooking;
  const bookingList = Array.isArray(bookingNode) ? bookingNode : bookingNode ? [bookingNode] : [];

  for (const b of bookingList) {
    const timetable = b?.TimeTable;
    const itemsNode = b?.BookingItems?.T_AirBookingItem;
    const items = Array.isArray(itemsNode) ? itemsNode : itemsNode ? [itemsNode] : [];

    const paxReferences: MakePrebookingPaxRef[] = [];
    for (const item of items) {
      const refNode = item?.PaxReference;
      const refList = Array.isArray(refNode) ? refNode : refNode ? [refNode] : [];
      for (const r of refList) {
        paxReferences.push({
          localSequenceNo: parseNum(r?.LocalSequenceNo),
          passengerId: parseStr(r?.PassengerId),
          paxReferenceId: parseStr(r?.PaxReferenceId),
          localPaxType: parseStr(r?.LocalPaxType),
          age: parseNum(r?.Age),
        });
      }
    }

    airBookings.push({
      productId: parseStr(b?.ProductId),
      bookingCode: parseStr(b?.BookingCode),
      status: parseStr(b?.Status),
      totalFare: parseNum(b?.TotalFare),
      baseFare: parseNum(b?.BaseFare),
      taxes: parseNum(b?.Taxes),
      serviceFee: parseNum(b?.ServiceFee),
      currency: parseStr(b?.Currency),
      isRefundable: parseBool(b?.IsRefundable),
      canBeReserved: parseBool(b?.CanBeReserved),
      prebookingExpiresAt: parseStr(timetable?.Prebooking_ExpiresAt),
      reservationExpiresAt: parseStr(timetable?.Reservation_ExpiresAt),
      reservationDate: parseStr(timetable?.ReservationDate),
      paxReferences,
    });
  }

  return {
    hasError,
    errorMessage,
    isUnknownSystemError,
    shoppingFileId,
    ifFinalized,
    isPriceChanged,
    isFlightInfoChanged,
    isReservationCancelled,
    isCcPaymentEnabled,
    isRaPaymentEnabled,
    remainingSum,
    maxSc,
    minSc,
    airBookings: airBookings.length > 0 ? airBookings : undefined,
    details: result,
  };
}
