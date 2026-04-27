import { XMLParser } from 'fast-xml-parser';

export interface UpdatePassengerResponse {
  hasError?: boolean;
  errorMessage?: string;
  shoppingFileId?: string;
  details?: any;
}

/**
 * UpdatePassengers SOAP response'unu parse eder
 */
export function mapUpdatePassengerXmlToResponse(rawXml: string): UpdatePassengerResponse {
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
    doc?.Envelope?.Body?.UpdatePassengersResponse?.UpdatePassengersResult ??
    doc?.Body?.UpdatePassengersResponse?.UpdatePassengersResult ??
    doc?.UpdatePassengersResponse?.UpdatePassengersResult;

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

  const shoppingFile = result?.ShoppingFile;
  const shoppingFileId = shoppingFile?.Id ?? shoppingFile?.id;

  return {
    hasError,
    errorMessage: errorMessage ? String(errorMessage).trim() : undefined,
    shoppingFileId: shoppingFileId ? String(shoppingFileId).trim() : undefined,
    details: result,
  };
}
