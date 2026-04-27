import { XMLParser } from 'fast-xml-parser';

export interface Init3DPaymentResponse {
  hasError?: boolean;
  errorMessage?: string;
  /** BiletBank 3D yönlendirme URL'si (IO_Init3DPayment_Result.ContinueUrl) */
  continueUrl?: string;
  /** Ödeme referans ID'si (callback'te kullanılır) */
  paymentId?: string;
  /** Ödeme durumu */
  status?: string;
  details?: any;
}

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

function safeStr(val: unknown): string | undefined {
  if (val === undefined || val === null || isXmlNil(val)) return undefined;
  const s = String(val).trim();
  return s.length > 0 && s !== 'null' ? s : undefined;
}

export function mapInit3DPaymentXmlToResponse(rawXml: string): Init3DPaymentResponse {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    removeNSPrefix: true,
    parseTagValue: true,
    parseAttributeValue: true,
    trimValues: true,
  });

  const doc: any = parser.parse(rawXml);

  // WSDL: MakePayment_Init3DPaymentResponse → MakePayment_Init3DPaymentResult
  const result =
    doc?.Envelope?.Body?.MakePayment_Init3DPaymentResponse?.MakePayment_Init3DPaymentResult ??
    doc?.Body?.MakePayment_Init3DPaymentResponse?.MakePayment_Init3DPaymentResult ??
    doc?.MakePayment_Init3DPaymentResponse?.MakePayment_Init3DPaymentResult;

  const hasError = (() => {
    const v = result?.HasError;
    if (typeof v === 'boolean') return v;
    if (typeof v === 'string') return v.toLowerCase() === 'true';
    return false;
  })();

  const errorMessage =
    safeStr(result?.ServiceError?.ErrorMessage) ??
    safeStr(result?.ServiceError?.DebugMessage);

  // IO_Init3DPayment_Result.ContinueUrl → 3D yönlendirme URL'si
  const continueUrl = safeStr(result?.ContinueUrl);

  // PaymentId
  const paymentId = safeStr(result?.PaymentId);

  const status = safeStr(result?.ShoppingFile?.Status) ?? safeStr(result?.Status);

  return {
    hasError,
    errorMessage,
    continueUrl,
    paymentId,
    status,
    details: result,
  };
}
