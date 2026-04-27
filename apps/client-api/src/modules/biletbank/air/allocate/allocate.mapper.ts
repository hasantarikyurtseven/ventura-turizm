import { XMLParser } from 'fast-xml-parser';

export interface AllocatePaxRef {
  localSequenceNo?: number;
  passengerId?: string;
  paxReferenceId?: string;
}

export interface AllocateResponse {
  hasError?: boolean;
  errorMessage?: string;
  allocateId?: string;
  productId?: string;
  shoppingFileId?: string;
  paxReferences?: AllocatePaxRef[];
  details?: any;
}

/**
 * Allocate SOAP response'unu parse eder
 */
export function mapAllocateXmlToResponse(rawXml: string): AllocateResponse {
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
    doc?.Envelope?.Body?.AllocateResponse?.AllocateResult ??
    doc?.Body?.AllocateResponse?.AllocateResult ??
    doc?.AllocateResponse?.AllocateResult;

  const hasErrorRaw = result?.HasError;
  const hasError =
    typeof hasErrorRaw === 'boolean'
      ? hasErrorRaw
      : typeof hasErrorRaw === 'string'
        ? hasErrorRaw.toLowerCase() === 'true'
        : false;

  const errorMessage =
    result?.ServiceError?.ErrorMessage ||
    result?.ServiceError?.DebugMessage ||
    result?.ErrorMessage ||
    undefined;

  let allocateId = result?.AllocateId || result?.ProductItemId;
  let productId = result?.ProductItemId;
  const shoppingFileId = result?.ShoppingFileId;

  // BiletBank: ShoppingFile.AirBookings.T_AirBooking.BookingItems.T_AirBookingItem
  const paxReferences: AllocatePaxRef[] = [];
  if (result?.ShoppingFile) {
    const sf = result.ShoppingFile;
    const bookingNode = sf?.AirBookings?.T_AirBooking;
    const bookings = Array.isArray(bookingNode) ? bookingNode : bookingNode ? [bookingNode] : [];
    for (const booking of bookings) {
      const bi = booking?.BookingItems;
      const items = bi?.T_AirBookingItem ?? bi?.AirBookingItem ?? bi?.T_BookingItem;
      const itemList = Array.isArray(items) ? items : items ? [items] : [];
      for (const item of itemList) {
        if (!productId) {
          const extracted = item?.ProductItemId;
          if (extracted) {
            productId = String(extracted).trim();
            if (!allocateId) allocateId = productId;
          }
        }
        // PaxReference bilgilerini çıkar (UpdatePassenger'da TempTag olarak kullanılacak)
        const refs = item?.PaxReference;
        const refList = Array.isArray(refs) ? refs : refs ? [refs] : [];
        for (const r of refList) {
          const seqNo = r?.LocalSequenceNo !== undefined ? Number(r.LocalSequenceNo) : undefined;
          const pid = r?.PassengerId ? String(r.PassengerId).trim() : undefined;
          const prid = r?.PaxReferenceId ? String(r.PaxReferenceId).trim() : undefined;
          paxReferences.push({ localSequenceNo: seqNo, passengerId: pid, paxReferenceId: prid });
        }
      }
    }
  }

  return {
    hasError,
    errorMessage: errorMessage ? String(errorMessage).trim() : undefined,
    allocateId: allocateId ? String(allocateId).trim() : undefined,
    productId: productId ? String(productId).trim() : undefined,
    shoppingFileId: shoppingFileId ? String(shoppingFileId).trim() : undefined,
    paxReferences: paxReferences.length > 0 ? paxReferences : undefined,
    details: result,
  };
}
