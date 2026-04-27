import { XMLParser } from 'fast-xml-parser';

export interface MakePaymentAirBooking {
  productId?: string;
  bookingCode?: string;
  status?: string;
  totalFare?: number;
  baseFare?: number;
  taxes?: number;
  serviceFee?: number;
  netFare?: number;
  currency?: string;
  isRefundable?: boolean;
  canBeReserved?: boolean;
  type?: string;
  prebookingExpiresAt?: string;
  reservationExpiresAt?: string;
  reservationDate?: string;
  creationDate?: string;
}

export interface MakePaymentResponse {
  hasError?: boolean;
  errorMessage?: string;
  paymentId?: string;
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
  grandTotal?: number;
  airBookings?: MakePaymentAirBooking[];
  details?: any;
}

function parseBool(val: unknown): boolean | undefined {
  if (val === undefined || val === null) return undefined;
  if (typeof val === 'boolean') return val;
  const s = String(val).toLowerCase().trim();
  if (s === 'true') return true;
  if (s === 'false') return false;
  return undefined;
}

function parseNum(val: unknown): number | undefined {
  if (val === undefined || val === null) return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}

function parseStr(val: unknown): string | undefined {
  if (val === undefined || val === null) return undefined;
  const s = String(val).trim();
  return s.length > 0 && s !== 'null' ? s : undefined;
}

export function mapMakePaymentXmlToResponse(rawXml: string): MakePaymentResponse {
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
    doc?.Envelope?.Body?.MakePayment_FromRunningAccountResponse?.MakePayment_FromRunningAccountResult ??
    doc?.Body?.MakePayment_FromRunningAccountResponse?.MakePayment_FromRunningAccountResult ??
    doc?.MakePayment_FromRunningAccountResponse?.MakePayment_FromRunningAccountResult;

  const hasError = parseBool(result?.HasError) ?? false;
  const errorMessage =
    parseStr(result?.ServiceError?.ErrorMessage) ??
    parseStr(result?.ServiceError?.DebugMessage);

  const paymentId = parseStr(result?.PaymentId);
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
  const grandTotal = parseNum(sf?.PriceSummary?.GrandTotal);

  const airBookings: MakePaymentAirBooking[] = [];
  const bookingNode = sf?.AirBookings?.T_AirBooking;
  const bookingList = Array.isArray(bookingNode) ? bookingNode : bookingNode ? [bookingNode] : [];

  for (const b of bookingList) {
    const timetable = b?.TimeTable;
    airBookings.push({
      productId: parseStr(b?.ProductId),
      bookingCode: parseStr(b?.BookingCode),
      status: parseStr(b?.Status),
      totalFare: parseNum(b?.TotalFare),
      baseFare: parseNum(b?.BaseFare),
      taxes: parseNum(b?.Taxes),
      serviceFee: parseNum(b?.ServiceFee),
      netFare: parseNum(b?.NetFare),
      currency: parseStr(b?.Currency),
      isRefundable: parseBool(b?.IsRefundable),
      canBeReserved: parseBool(b?.CanBeReserved),
      type: parseStr(b?.Type),
      prebookingExpiresAt: parseStr(timetable?.Prebooking_ExpiresAt),
      reservationExpiresAt: parseStr(timetable?.Reservation_ExpiresAt),
      reservationDate: parseStr(timetable?.ReservationDate),
      creationDate: parseStr(timetable?.CreationDate),
    });
  }

  return {
    hasError,
    errorMessage,
    paymentId,
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
    grandTotal,
    airBookings: airBookings.length > 0 ? airBookings : undefined,
    details: result,
  };
}
