import { XMLParser } from 'fast-xml-parser';

export interface FinalizeShoppingResponse {
  hasError: boolean;
  errorMessage?: string;
  ifFinalized?: boolean;
  bookingCode?: string;
  status?: string;
  totalFare?: number;
  currency?: string;
  paymentAmount?: number;
  paymentCurrency?: string;
  ccCardNumber?: string;
  ccCardHolder?: string;
  ccBankName?: string;
  ccInstallmentCount?: number;
  paymentConfirmedAmount?: number;
  finalizedDate?: string;
  shoppingFileId?: string;
  passengerName?: string;
}

function isXmlNil(val: unknown): boolean {
  if (typeof val !== 'object' || val === null) return false;
  const o = val as Record<string, unknown>;
  return o['nil'] === true || o['nil'] === 'true' || o['i:nil'] === 'true';
}

function safeStr(val: unknown): string | undefined {
  if (val === undefined || val === null || isXmlNil(val)) return undefined;
  const s = String(val).trim();
  return s.length > 0 && s !== 'null' ? s : undefined;
}

function safeNum(val: unknown): number | undefined {
  if (val === undefined || val === null || isXmlNil(val)) return undefined;
  const n = parseFloat(String(val));
  return isNaN(n) ? undefined : n;
}

function safeBool(val: unknown): boolean | undefined {
  if (val === undefined || val === null) return undefined;
  if (typeof val === 'boolean') return val;
  const s = String(val).toLowerCase();
  if (s === 'true') return true;
  if (s === 'false') return false;
  return undefined;
}

export function mapFinalizeShoppingXmlToResponse(rawXml: string): FinalizeShoppingResponse {
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
    doc?.Envelope?.Body?.FinalizeShoppingResponse?.FinalizeShoppingResult ??
    doc?.Body?.FinalizeShoppingResponse?.FinalizeShoppingResult ??
    doc?.FinalizeShoppingResponse?.FinalizeShoppingResult;

  const hasError = (() => {
    const v = result?.HasError;
    if (typeof v === 'boolean') return v;
    if (typeof v === 'string') return v.toLowerCase() === 'true';
    return true;
  })();

  const errorMessage =
    safeStr(result?.ServiceError?.ErrorMessage) ??
    safeStr(result?.ServiceError?.DebugMessage);

  const sf = result?.ShoppingFile;

  const airBooking = (() => {
    const ab = sf?.AirBookings?.T_AirBooking;
    return Array.isArray(ab) ? ab[0] : ab;
  })();

  const payment = (() => {
    const p = sf?.Payments?.T_Payment ?? sf?.Payments?.Payment;
    return Array.isArray(p) ? p[0] : p;
  })();

  const passenger = (() => {
    const p = sf?.Passengers?.T_Passenger;
    return Array.isArray(p) ? p[0] : p;
  })();

  return {
    hasError,
    errorMessage,
    ifFinalized: safeBool(sf?.IfFinalized),
    bookingCode: safeStr(airBooking?.BookingCode),
    status: safeStr(airBooking?.Status),
    totalFare: safeNum(airBooking?.TotalFare),
    currency: safeStr(airBooking?.Currency),
    shoppingFileId: safeStr(sf?.Id),
    paymentAmount: safeNum(payment?.PaymentAmount),
    paymentCurrency: safeStr(payment?.PaymentCurrency) ?? safeStr(payment?.SellingCurrency),
    paymentConfirmedAmount: safeNum(payment?.PaymentConfirmedAmount),
    ccCardNumber: safeStr(payment?.CC_CardNumber),
    ccCardHolder: safeStr(payment?.CC_CardHolder),
    ccBankName: safeStr(payment?.CC_BankName),
    ccInstallmentCount: safeNum(payment?.CC_InstallmentCount),
    finalizedDate: safeStr(payment?.CurrentHandling_FinalizedDate),
    passengerName: passenger
      ? `${safeStr(passenger.FirstName) ?? ''} ${safeStr(passenger.LastName) ?? ''}`.trim()
      : undefined,
  };
}
