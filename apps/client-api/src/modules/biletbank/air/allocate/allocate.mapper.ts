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
 * Allocate SOAP response'unu parse eder.
 *
 * UpdatePassengers için doğru ProductId zinciri:
 *   1) AllocateResult.LastAllocatedProductIds.guid  ← BiletBank'ın "sonraki adımda bunu kullan" işareti
 *   2) ShoppingFile.AirBookings.T_AirBooking.ProductId   ← booking seviyesi (her zaman #1'e eşit)
 *   3) T_AirBookingItem.ProductItemId                    ← item seviyesi (farklı olabilir, fallback)
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

  let allocateId: string | undefined = result?.AllocateId
    ? String(result.AllocateId).trim()
    : undefined;

  const shoppingFileId = result?.ShoppingFileId;

  // 1) LastAllocatedProductIds — AllocateResult üst seviyesinde, BiletBank tarafından
  //    "bu ID'leri UpdatePassengers'da kullan" şeklinde açıkça sağlanır.
  let productId: string | undefined = undefined;
  const lastAllocRaw = result?.LastAllocatedProductIds?.guid;
  if (lastAllocRaw) {
    const first = Array.isArray(lastAllocRaw) ? lastAllocRaw[0] : lastAllocRaw;
    if (first) productId = String(first).trim();
  }

  const paxReferences: AllocatePaxRef[] = [];

  if (result?.ShoppingFile) {
    const sf = result.ShoppingFile;
    const bookingNode = sf?.AirBookings?.T_AirBooking;
    const bookings = Array.isArray(bookingNode) ? bookingNode : bookingNode ? [bookingNode] : [];
    for (const booking of bookings) {
      // 2) T_AirBooking.ProductId — booking seviyesi (LastAllocatedProductIds ile aynı değer)
      if (!productId && booking?.ProductId) {
        productId = String(booking.ProductId).trim();
      }

      const bi = booking?.BookingItems;
      const items = bi?.T_AirBookingItem ?? bi?.AirBookingItem ?? bi?.T_BookingItem;
      const itemList = Array.isArray(items) ? items : items ? [items] : [];
      for (const item of itemList) {
        // 3) T_AirBookingItem.ProductItemId — fallback (item seviyesi)
        // NOT: Bu değer booking seviyesinden farklı olabilir; UpdatePassengers için kullanılmaz.
        if (!productId && item?.ProductItemId) {
          productId = String(item.ProductItemId).trim();
        }
        // PaxReference bilgileri — UpdatePassengers'da TempTag = PaxReferenceId
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

  if (!allocateId) {
    allocateId = productId;
  }

  console.warn(
    '[MAPPER DEBUG] lastAllocatedProductId=' + (result?.LastAllocatedProductIds?.guid ?? 'NONE') +
    ' final productId=' + productId,
  );

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
