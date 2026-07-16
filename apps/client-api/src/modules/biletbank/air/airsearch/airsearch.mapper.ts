import { XMLParser } from 'fast-xml-parser';

export interface FlightCardSegment {
  id?: string;
  marketingAirline?: string;
  operatingAirline?: string;
  flightNumber?: string;
  cabinClass?: string;
  bookingClass?: string;
  fareBasis?: string;
  fareType?: string;

  originCode?: string;
  destinationCode?: string;
  countryCodeOfOrigin?: string;
  countryCodeOfDestination?: string;

  departureDateTime?: string; // ISO
  arrivalDateTime?: string; // ISO
  duration?: string; // "01:05"
  hasTechnicalStop?: boolean;
}

export interface BrandedRule {
  application?: string; // F (Free), C (Chargeable), N (Not Applicable)
  displayType?: string; // Display, NotDisplay
  ruleDescription?: string;
  serviceGroup?: string; // BG (Baggage), CY (Carry On), SE (Seat), VC (Change/Refund), ML (Meal)
}

export interface FlightBrandOption {
  id: string; // BrandedFareItemId
  brandId?: string; // BrandId (fare component)
  brandCode?: string;
  brandName?: string;
  baggageAllowanceId?: number; // FreeBaggageAllowanceId
  baggageDescription?: string; // e.g., "15kg", "20kg"
  rules?: BrandedRule[]; // DisplayType === "Display" olan kurallar
  totalFare: number;
  totalTaxes: number;
  currency: string;
}

export interface FlightCard {
  id: string; // ProductId
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  departure: {
    airport: string;
    airportCode: string;
    city: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    airportCode: string;
    city: string;
    time: string;
    date: string;
  };
  duration: string;
  stops: number;
  stopDetails?: string;
  price: number;
  currency: string;
  baggage: string;
  cabinClass: string;
  aircraft?: string;
  segments?: FlightCardSegment[];
  brandOptions?: FlightBrandOption[];

  optionFlag?: string; // OUT / IN
  /** RecommendationBox kaynaklı bacaklarda rota eşleştirme anahtarı */
  legDedupeKey?: string;
  /** Allocate için RecommendationBox + SubOptions akışı gerektirir */
  isRecommendationLeg?: boolean;
  bookingProvider?: string;
  bookingProviderId?: number;
  validatingCarrier?: string;
  contentType?: string; // NDC vb.
  pricingType?: string; // Public vb.
  isRefundable?: boolean;
  isReservable?: boolean;
  isVoidable?: boolean;
  isCharter?: boolean;
  isLowCost?: boolean;
  isNdc?: boolean;
  isEticket?: boolean;
  isFlexSC?: boolean;
}

/** Gidiş-dönüş RecommendationBox eşleşmeleri (Allocate SubOptions için) */
export interface RecommendationLink {
  productId: string;
  outboundSubOptionId: string;
  returnSubOptionId: string;
  outboundDedupeKey: string;
  returnDedupeKey: string;
  totalFare: number;
}

function ensureArray<T>(v: T | T[] | undefined | null): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function parseBool(v: unknown): boolean | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') {
    const lower = v.toLowerCase();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
  }
  return undefined;
}

function parsePtTimeToMinutes(pt?: string): number | undefined {
  // örn: PT5H45M, PT50M, PT6H
  if (!pt || typeof pt !== 'string') return undefined;
  const m = pt.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return undefined;
  const hours = m[1] ? parseInt(m[1], 10) : 0;
  const mins = m[2] ? parseInt(m[2], 10) : 0;
  const secs = m[3] ? parseInt(m[3], 10) : 0;
  return hours * 60 + mins + (secs ? Math.round(secs / 60) : 0);
}

function addMinutesToDate(dateStr: string, minutes: number): Date | undefined {
  if (!dateStr) return undefined;
  const base = new Date(dateStr);
  if (Number.isNaN(base.getTime())) return undefined;
  return new Date(base.getTime() + minutes * 60_000);
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function formatHHmm(d?: Date): string {
  if (!d) return '';
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function formatYYYYMMDD(d?: Date): string {
  if (!d) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function currencySymbol(code: string): string {
  switch ((code || '').toUpperCase()) {
    case 'TRY':
      return '₺';
    case 'EUR':
      return '€';
    case 'USD':
      return '$';
    default:
      return code || '';
  }
}

/** A_Flight için benzersiz anahtar (gidiş/dönüş tekilleştirme — rota bazlı) */
function getAFlightDedupeKey(af: any): string {
  const segs = ensureArray(af?.Segments?.A_FlightSegment);
  if (!segs.length) return String(af?.FlightId || '').trim();
  return segs
    .map((seg) =>
      [
        seg.FlightNumber,
        seg.DepartureDate,
        seg.DepartureAirport,
        seg.ArrivalAirport,
      ]
        .map((v) => String(v || '').trim())
        .join(':'),
    )
    .join('|');
}

/** A_Flight için id (allocate için FlightId tercih edilir) */
function getAFlightId(af: any, box: any): string {
  return String(af?.FlightId || box?.ProductId || '').trim();
}

/** RecommendationBox içindeki A_FlightSegment → T_Segment benzeri yapı */
function mapAFlightSegmentToTSegment(seg: any): any {
  return {
    Id: seg?.Id,
    OriginCode: seg?.DepartureAirport,
    DestinationCode: seg?.ArrivalAirport,
    DepartureDay: seg?.DepartureDate,
    ArrivalDay: seg?.ArrivalDate,
    DepartureTime: seg?.DepartureTime,
    ArrivalTime: seg?.ArrivalTime,
    FlightNumber: seg?.FlightNumber,
    MarketingAirline: seg?.MarketingAirline,
    OperatingAirline: seg?.OperatingAirline,
    Duration: seg?.Duration,
    CabinClass: seg?.Cabin,
    Cabin: seg?.Cabin,
    BookingClass: seg?.BookingClass,
    FareBasis: seg?.FareBasis,
    FareType: seg?.FareType,
    Equipment: seg?.EquipmentType,
    HasTechnicalStop: seg?.isTechnicalStop,
  };
}

/** RecommendationBox A_Flight → T_FlightOption benzeri pseudo obje */
function aFlightToPseudoOption(af: any, box: any, optionFlag: 'OUT' | 'IN'): any {
  const segments = ensureArray(af?.Segments?.A_FlightSegment).map(mapAFlightSegmentToTSegment);
  const dedupeKey = getAFlightDedupeKey(af);
  const subOptionId = getAFlightId(af, box);

  return {
    // UI seçimi için benzersiz id — allocate'de ProductId olarak KULLANILMAZ
    ProductId: `${optionFlag}:${dedupeKey}`,
    Currency: box?.Currency,
    TotalFare: Number(box?.TotalFare ?? box?.NetFare ?? 0) || 0,
    NetFare: Number(box?.NetFare ?? 0) || 0,
    Segments: { T_Segment: segments },
    BrandedFares: box?.BrandedFares,
    FreeBaggageAllowances: box?.BrandedFares?.T_BrandedFare_v2?.FreeBaggageAllowances ?? box?.FreeBaggageAllowances,
    BrandedItems: box?.BrandedFares?.T_BrandedFare_v2?.BrandedItems ?? box?.BrandedItems,
    OptionFlag: optionFlag,
    ValidatingCarrier: box?.ValidatingCarrier,
    BookingProvider: box?.BookingProvider,
    BookingProviderId: box?.BookingProviderId,
    IsRefundable: box?.IsRefundable,
    IsReservable: box?.IsReservable,
    IsEticket: box?.IsEticket,
    FlightRuleAttribute: box?.FlightRuleAttribute,
    _legDedupeKey: dedupeKey,
    _isRecommendationLeg: true,
    _subOptionId: subOptionId,
    _recommendationProductId: String(box?.ProductId || '').trim(),
  };
}

/** RecommendationBox gidiş-dönüş kombinasyonlarını toplar */
function collectRecommendationLinks(result: any): RecommendationLink[] {
  const recBoxes = ensureArray(result?.Recommendations?.T_RecommendationBox);
  const links: RecommendationLink[] = [];

  for (const box of recBoxes) {
    const productId = String(box?.ProductId || '').trim();
    if (!productId) continue;

    const totalFare = Number(box?.TotalFare ?? box?.NetFare ?? 0) || 0;
    const depFlights = ensureArray(box?.DepartureFlights?.A_Flight);
    const retFlights = ensureArray(box?.ReturnFlights?.A_Flight);

    for (const dep of depFlights) {
      for (const ret of retFlights) {
        const outboundDedupeKey = getAFlightDedupeKey(dep);
        const returnDedupeKey = getAFlightDedupeKey(ret);
        const outboundSubOptionId = getAFlightId(dep, box);
        const returnSubOptionId = getAFlightId(ret, box);
        if (!outboundDedupeKey || !returnDedupeKey || !outboundSubOptionId || !returnSubOptionId) continue;

        links.push({
          productId,
          outboundSubOptionId,
          returnSubOptionId,
          outboundDedupeKey,
          returnDedupeKey,
          totalFare,
        });
      }
    }
  }

  return links;
}

/**
 * RT aramalarda FlightOptions boş geldiğinde Recommendations.T_RecommendationBox
 * içinden gidiş (OUT) ve dönüş (IN) uçuşlarını çıkarır.
 */
function collectFlightsFromRecommendations(result: any): any[] {
  const recBoxes = ensureArray(result?.Recommendations?.T_RecommendationBox);
  if (!recBoxes.length) return [];

  const legMap = new Map<string, any>();

  const upsertLeg = (af: any, box: any, optionFlag: 'OUT' | 'IN') => {
    const dedupeKey = getAFlightDedupeKey(af);
    if (!dedupeKey) return;
    const key = `${optionFlag}:${dedupeKey}`;
    const boxFare = Number(box?.TotalFare ?? box?.NetFare ?? 0) || 0;
    const pseudo = aFlightToPseudoOption(af, box, optionFlag);
    const existing = legMap.get(key);
    if (!existing || boxFare < (Number(existing._boxFare) || Infinity)) {
      legMap.set(key, { ...pseudo, _boxFare: boxFare });
    }
  };

  for (const box of recBoxes) {
    const depFlights = ensureArray(box?.DepartureFlights?.A_Flight);
    const retFlights = ensureArray(box?.ReturnFlights?.A_Flight);

    depFlights.forEach((af) => upsertLeg(af, box, 'OUT'));
    retFlights.forEach((af) => upsertLeg(af, box, 'IN'));
  }

  return Array.from(legMap.values()).map(({ _boxFare, ...opt }) => opt);
}

/** FlightOptions boş mu? (nil veya T_FlightOption yok) */
function hasFlightOptions(result: any): boolean {
  const fo = result?.FlightOptions;
  if (!fo) return false;
  if (fo?.T_FlightOption) return true;
  if (Array.isArray(fo) && fo.length > 0) return true;
  return false;
}

export function mapAirSearchXmlToFlights(rawXml: string): {
  hasError?: boolean;
  searchId?: string;
  shoppingFileId?: string;
  flights: FlightCard[];
  recommendationLinks?: RecommendationLink[];
} {
  const emptyResult = { hasError: true, searchId: undefined, shoppingFileId: undefined, flights: [], recommendationLinks: [] as RecommendationLink[] };

  if (!rawXml || typeof rawXml !== 'string' || rawXml.trim().length === 0) {
    return emptyResult;
  }
  const trimmed = rawXml.trim();
  if (!trimmed.startsWith('<') && !trimmed.startsWith('<?xml')) {
    return emptyResult;
  }

  const parser = new XMLParser({
    ignoreAttributes: true,
    removeNSPrefix: true,
    parseTagValue: true,
    trimValues: true,
    ignoreDeclaration: true,
  });

  let doc: any;
  try {
    doc = parser.parse(rawXml);
  } catch {
    return emptyResult;
  }
  if (!doc || typeof doc !== 'object') {
    return emptyResult;
  }

  // SOAP Fault kontrolü
  const fault = doc?.Envelope?.Body?.Fault ?? doc?.Body?.Fault;
  if (fault) {
    const faultString = fault?.faultstring ?? fault?.FaultString ?? fault?.Reason?.Text ?? 'SOAP Fault';
    return {
      hasError: true,
      searchId: undefined,
      shoppingFileId: undefined,
      flights: [],
    };
  }

  const result =
    doc?.Envelope?.Body?.AirSearchResponse?.AirSearchResult ??
    doc?.Body?.AirSearchResponse?.AirSearchResult ??
    doc?.AirSearchResponse?.AirSearchResult ??
    doc?.IO_AirSearchResult;

  if (!result) {
    return emptyResult;
  }

  const hasErrorRaw = result?.HasError;
  const hasError =
    typeof hasErrorRaw === 'boolean'
      ? hasErrorRaw
      : typeof hasErrorRaw === 'string'
        ? hasErrorRaw.toLowerCase() === 'true'
        : undefined;

  const searchId = result?.SearchId;
  const shoppingFileId = result?.ShoppingFileId;

  // FlightOptions farklı yapılarda olabilir, tüm olasılıkları kontrol et
  let options: any[] = [];
  
  // Olası yapı 1: FlightOptions.T_FlightOption (array)
  if (result?.FlightOptions?.T_FlightOption) {
    options = ensureArray(result.FlightOptions.T_FlightOption);
  }
  // Olası yapı 2: FlightOptions doğrudan array
  else if (Array.isArray(result?.FlightOptions)) {
    options = result.FlightOptions;
  }
  // Olası yapı 3: RecommendationBox içinde
  else if (result?.RecommendationBox) {
    const recBox = result.RecommendationBox;
    if (recBox?.FlightOptions?.T_FlightOption) {
      options = ensureArray(recBox.FlightOptions.T_FlightOption);
    } else if (Array.isArray(recBox?.FlightOptions)) {
      options = recBox.FlightOptions;
    }
  }
  // Olası yapı 4: ProductItem array
  else if (result?.ProductItem) {
    options = ensureArray(result.ProductItem);
  }

  // Olası yapı 5: RT aramalarda FlightOptions boş, uçuşlar Recommendations içinde
  let recommendationLinks: RecommendationLink[] = [];
  if (options.length === 0 && !hasFlightOptions(result)) {
    options = collectFlightsFromRecommendations(result);
    recommendationLinks = collectRecommendationLinks(result);
  }

  const flights: FlightCard[] = options
    .map((opt: any) => {
      const productId = String(opt?.ProductId || '').trim();
      if (!productId) return undefined;

      const segments = ensureArray(opt?.Segments?.T_Segment);
      const firstSeg = segments[0];
      const lastSeg = segments[segments.length - 1];

      const depMinutes = parsePtTimeToMinutes(firstSeg?.DepartureTime);
      const arrMinutes = parsePtTimeToMinutes(lastSeg?.ArrivalTime);

      const depDt = depMinutes !== undefined ? addMinutesToDate(firstSeg?.DepartureDay, depMinutes) : undefined;
      const arrDt = arrMinutes !== undefined ? addMinutesToDate(lastSeg?.ArrivalDay, arrMinutes) : undefined;

      const stopPoints = segments.slice(0, -1).map((s: any) => s?.DestinationCode).filter(Boolean);

      const currencyCode = String(opt?.Currency || '').trim();

      // BrandedFares -> brandOptions (bazen T_BrandedFare_v2, bazen doğrudan BrandedFares altında)
      const brandedRoot = opt?.BrandedFares?.T_BrandedFare_v2 ?? opt?.BrandedFares;

      // FreeBaggageAllowances map'i (bazen brandedRoot, bazen opt altında)
      const baggageAllowancesMap = new Map<number, string>();
      const freeBaggageRoot = brandedRoot?.FreeBaggageAllowances ?? opt?.FreeBaggageAllowances;
      const baggageAllowances = ensureArray(freeBaggageRoot?.FreeBaggageAllowance);
      baggageAllowances.forEach((bag: any) => {
        const bagId = Number(bag?.Id);
        if (!bagId || Number.isNaN(bagId)) return;
        
        const paxBaggage = bag?.FBA?.PaxBaggageAllowance;
        const paxFBA = Array.isArray(paxBaggage) ? paxBaggage[0] : paxBaggage;
        if (!paxFBA) return;
        
        const allowance = paxFBA?.PaxFBA?.Allowance;
        const unit = paxFBA?.PaxFBA?.Unit;
        const type = paxFBA?.PaxFBA?.Type;
        
        if (allowance && unit) {
          const unitStr = unit === 'K' ? 'kg' : unit === 'N' ? 'adet' : '';
          const typeStr = type === 'Weight' ? '' : type === 'Piece' ? 'adet' : '';
          baggageAllowancesMap.set(bagId, `${allowance}${unitStr}`);
        }
      });

      // BrandedItems map'i oluştur (BrandId -> BrandCode, BrandName, BrandedRules)
      const brandedItemsMap = new Map<string, { brandCode?: string; brandName?: string; rules?: BrandedRule[] }>();
      
      // BrandedItems yapısını parse et (bazen brandedRoot altında, bazen opt altında)
      const brandedItemsRaw = brandedRoot?.BrandedItems ?? opt?.BrandedItems;
      let brandedItemsList: any[] = [];
      
      if (brandedItemsRaw) {
        // Eğer direkt array ise
        if (Array.isArray(brandedItemsRaw)) {
          brandedItemsList = brandedItemsRaw;
        }
        // Eğer BrandedItem property'si varsa
        else if (brandedItemsRaw.BrandedItem) {
          brandedItemsList = ensureArray(brandedItemsRaw.BrandedItem);
        }
        // Eğer direkt object ise (tek item)
        else if (brandedItemsRaw.BrandId) {
          brandedItemsList = [brandedItemsRaw];
        }
      }
      
      brandedItemsList.forEach((item: any) => {
        const brandId = String(item?.BrandId || '').trim();
        if (!brandId) return;
        
        const brandCode = item?.BrandCode ? String(item.BrandCode).trim() : undefined;
        const brandName = item?.BrandName ? String(item.BrandName).trim() : undefined;
        
        // BrandedRules parse et (sadece DisplayType === "Display" olanlar)
        const rules: BrandedRule[] = [];
        const brandedRules = ensureArray(item?.BrandedRules?.BrandedRule);
        brandedRules.forEach((rule: any) => {
          if (rule?.DisplayType === 'Display') {
            // RuleDescription'ı string'e çevir (XML'den obje gelebilir)
            let ruleDescription: string | undefined = undefined;
            if (rule?.RuleDescription) {
              // Boolean değerleri atla
              if (typeof rule.RuleDescription === 'boolean') {
                return; // Bu kuralı ekleme
              }
              
              if (typeof rule.RuleDescription === 'string') {
                const trimmed = rule.RuleDescription.trim();
                // "true", "false" gibi geçersiz string'leri filtrele
                if (trimmed === 'true' || trimmed === 'false') {
                  return; // Bu kuralı ekleme
                }
                ruleDescription = trimmed;
              } else if (typeof rule.RuleDescription === 'object' && rule.RuleDescription !== null) {
                // Eğer obje ise, tüm olası property'leri kontrol et
                const descObj = rule.RuleDescription;
                ruleDescription = 
                  descObj.text ? String(descObj.text).trim() :
                  descObj.value ? String(descObj.value).trim() :
                  descObj._text ? String(descObj._text).trim() :
                  descObj._ ? String(descObj._).trim() :
                  // Eğer array ise ilk elemanı al
                  Array.isArray(descObj) && descObj.length > 0 ? String(descObj[0]).trim() :
                  // Son çare: JSON.stringify ile kontrol et ama sadece basit objeler için
                  Object.keys(descObj).length === 1 && descObj[Object.keys(descObj)[0]] 
                    ? String(descObj[Object.keys(descObj)[0]]).trim() :
                  undefined;
              } else {
                ruleDescription = String(rule.RuleDescription).trim();
              }
            }
            
            // Eğer hala undefined veya boş ise, bu kuralı atlama
            if (!ruleDescription || ruleDescription === 'undefined' || ruleDescription === 'null' || ruleDescription === 'true' || ruleDescription === 'false') {
              return; // Bu kuralı ekleme
            }
            
            rules.push({
              application: rule?.Application ? String(rule.Application).trim() : undefined,
              displayType: rule?.DisplayType ? String(rule.DisplayType).trim() : undefined,
              ruleDescription,
              serviceGroup: rule?.ServiceGroup ? String(rule.ServiceGroup).trim() : undefined,
            });
          }
        });
        
        brandedItemsMap.set(brandId, { brandCode, brandName, rules });
      });

      // BrandedFareItems -> brandOptions
      const brandedFareItems = ensureArray(brandedRoot?.BrandedFareItems?.BrandedFareItem);
      const brandOptions: FlightBrandOption[] = brandedFareItems
        .map((item: any) => {
          const id = String(item?.BrandedFareItemId ?? '').trim();
          if (!id) return undefined;

          const passengersRaw = item?.BrandedFarePassengers?.BrandedFarePassenger;
          const passenger = Array.isArray(passengersRaw) ? passengersRaw[0] : passengersRaw;
          const fareComponentsRaw = passenger?.FareComponents?.FareComponent;
          const fareComp = Array.isArray(fareComponentsRaw) ? fareComponentsRaw[0] : fareComponentsRaw;

          const brandId = fareComp?.BrandId ? String(fareComp.BrandId).trim() : undefined;
          const baggageAllowanceIdRaw = fareComp?.FreeBaggageAllowanceId;
          const baggageAllowanceId =
            baggageAllowanceIdRaw !== undefined && baggageAllowanceIdRaw !== null
              ? Number(baggageAllowanceIdRaw)
              : undefined;

          const brandedItemInfo = brandId ? brandedItemsMap.get(brandId) : undefined;
          const brandCodeRaw = brandedItemInfo?.brandCode ?? (fareComp?.BrandCode ? String(fareComp.BrandCode).trim() : undefined);
          const brandNameRaw = brandedItemInfo?.brandName ?? (fareComp?.BrandName ? String(fareComp.BrandName).trim() : undefined);
          const rules = brandedItemInfo?.rules ?? [];

          const baggageDescriptionRaw = baggageAllowanceId ? baggageAllowancesMap.get(baggageAllowanceId) : undefined;

          const totalFare = Number(item?.TotalFareInfo?.TotalFare ?? 0) || 0;
          const totalTaxes = Number(item?.TotalFareInfo?.TotalTaxes ?? 0) || 0;

          // JSON'da undefined atlandığı için her zaman string/array ver; UI'da "Paket" kalmasın
          const brandCode = brandCodeRaw && brandCodeRaw.trim() ? brandCodeRaw.trim() : (brandNameRaw && brandNameRaw.trim() ? brandNameRaw.trim() : 'Paket');
          const brandName = brandNameRaw && brandNameRaw.trim() ? brandNameRaw.trim() : (brandCodeRaw && brandCodeRaw.trim() ? brandCodeRaw.trim() : 'Paket');
          const baggageDescription = (baggageDescriptionRaw && String(baggageDescriptionRaw).trim()) ? String(baggageDescriptionRaw).trim() : undefined;

          return {
            id,
            brandId: brandId ?? undefined,
            brandCode,
            brandName,
            baggageAllowanceId: baggageAllowanceId ?? undefined,
            baggageDescription,
            rules,
            totalFare,
            totalTaxes,
            currency: currencySymbol(currencyCode),
          } as FlightBrandOption;
        })
        .filter(Boolean) as FlightBrandOption[];

      return {
        id: productId,
        airline: String(firstSeg?.MarketingAirline || opt?.ValidatingCarrier || opt?.BookingProvider || '').trim() || 'N/A',
        airlineLogo: String(firstSeg?.MarketingAirline || opt?.ValidatingCarrier || '').trim() || '—',
        flightNumber: String(firstSeg?.FlightNumber || '').trim() || '—',
        departure: {
          airport: '',
          airportCode: String(firstSeg?.OriginCode || '').trim() || '—',
          city: '',
          time: formatHHmm(depDt) || '',
          date: formatYYYYMMDD(depDt) || (String(firstSeg?.DepartureDay || '').split('T')[0] || ''),
        },
        arrival: {
          airport: '',
          airportCode: String(lastSeg?.DestinationCode || '').trim() || '—',
          city: '',
          time: formatHHmm(arrDt) || '',
          date: formatYYYYMMDD(arrDt) || (String(lastSeg?.ArrivalDay || '').split('T')[0] || ''),
        },
        duration:
          segments.length === 1
            ? String(firstSeg?.Duration || '').trim() || ''
            : '', // multi-leg için ileride hesaplayacağız
        stops: Math.max(segments.length - 1, 0),
        stopDetails: stopPoints.length ? stopPoints.join(', ') : undefined,
        
        // Fiyat: Eğer paketler varsa en ucuz paketin fiyatını göster, yoksa genel TotalFare'ı göster
        price: brandOptions.length > 0
          ? Math.min(...brandOptions.map(b => b.totalFare))
          : Number(opt?.TotalFare ?? opt?.NetFare ?? 0) || 0,
        currency: currencySymbol(currencyCode),
        
        // Baggage: En ucuz paketin bagaj bilgisini göster
        baggage: (() => {
          if (brandOptions.length > 0) {
            const cheapest = brandOptions.reduce((min, b) => b.totalFare < min.totalFare ? b : min, brandOptions[0]);
            return cheapest?.baggageDescription || '-';
          }
          return '-';
        })(),
        
        // CabinClass: En ucuz paketin adını göster (SUPER_ECO, ECO vb.), yoksa segment'ten gelen cabin class'ı kullan
        cabinClass: (() => {
          if (brandOptions.length > 0) {
            const cheapest = brandOptions.reduce((min, b) => b.totalFare < min.totalFare ? b : min, brandOptions[0]);
            if (cheapest?.brandName) return cheapest.brandName;
            if (cheapest?.brandCode) return cheapest.brandCode;
          }
          const segCabinClass = String(firstSeg?.CabinClass || '').trim();
          return segCabinClass || 'Economy';
        })(),
        aircraft: firstSeg?.Equipment ? String(firstSeg.Equipment) : undefined,
        segments: segments.map((s: any) => {
          const sDepMin = parsePtTimeToMinutes(s?.DepartureTime);
          const sArrMin = parsePtTimeToMinutes(s?.ArrivalTime);
          const sDep = sDepMin !== undefined ? addMinutesToDate(s?.DepartureDay, sDepMin) : undefined;
          const sArr = sArrMin !== undefined ? addMinutesToDate(s?.ArrivalDay, sArrMin) : undefined;
          return {
            id: s?.Id ? String(s.Id) : undefined,
            marketingAirline: s?.MarketingAirline,
            operatingAirline: s?.OperatingAirline,
            flightNumber: s?.FlightNumber,
            cabinClass: s?.CabinClass || s?.Cabin,
            bookingClass: s?.BookingClass,
            fareBasis: s?.FareBasis,
            fareType: (() => {
              const ft = s?.FareType;
              if (!ft) return undefined;
              if (typeof ft === 'string') return ft;
              if (ft?.string) return Array.isArray(ft.string) ? ft.string[0] : ft.string;
              return undefined;
            })(),
            originCode: s?.OriginCode,
            destinationCode: s?.DestinationCode,
            countryCodeOfOrigin: s?.CountryCodeOfOriginAirport,
            countryCodeOfDestination: s?.CountryCodeOfDestinationAirport,
            departureDateTime: sDep ? sDep.toISOString() : undefined,
            arrivalDateTime: sArr ? sArr.toISOString() : undefined,
            duration: s?.Duration,
            hasTechnicalStop: parseBool(s?.HasTechnicalStop),
          } as FlightCardSegment;
        }),
        brandOptions,

        optionFlag: opt?.OptionFlag ? String(opt.OptionFlag) : undefined,
        legDedupeKey: opt?._legDedupeKey ? String(opt._legDedupeKey) : undefined,
        isRecommendationLeg: opt?._isRecommendationLeg === true,
        bookingProvider: opt?.BookingProvider ? String(opt.BookingProvider) : undefined,
        bookingProviderId: opt?.BookingProviderId ? Number(opt.BookingProviderId) : undefined,
        validatingCarrier: opt?.ValidatingCarrier ? String(opt.ValidatingCarrier) : undefined,
        contentType: opt?.ContentType ? String(opt.ContentType) : undefined,
        pricingType: opt?.PricingType ? String(opt.PricingType) : undefined,
        isRefundable: parseBool(opt?.FlightRuleAttribute?.IsRefundable ?? opt?.IsRefundable),
        isReservable: parseBool(opt?.FlightRuleAttribute?.IsReservable ?? opt?.IsReservable),
        isVoidable: parseBool(opt?.FlightRuleAttribute?.IsVoidable),
        isCharter: parseBool(opt?.IsCharter),
        isLowCost: parseBool(opt?.IsLowCost),
        isNdc: parseBool(opt?.IsNdc),
        isEticket: parseBool(opt?.IsEticket),
        isFlexSC: parseBool(opt?.IsFlexSC),
      } as FlightCard;
    })
    .filter(Boolean) as FlightCard[];

  return { hasError, searchId, shoppingFileId, flights, recommendationLinks };
}

