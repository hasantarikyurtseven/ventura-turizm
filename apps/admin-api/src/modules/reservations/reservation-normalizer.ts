/**
 * client-api ve admin seed farklı alan adları kullanır; admin paneli tek bir DTO bekler.
 */
export function combinePointDateTime(
  dateStr?: string,
  timeStr?: string,
): Date | undefined {
  if (!dateStr) return undefined;
  const time = (timeStr || '00:00').trim();
  const normalizedTime =
    time.split(':').length === 2 ? `${time}:00` : time;

  // dd.MM.yyyy (client-api)
  const dmY = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(dateStr.trim());
  if (dmY) {
    const [, dd, mm, yyyy] = dmY;
    const iso = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T${normalizedTime}`;
    const d = new Date(iso);
    if (!isNaN(d.getTime())) return d;
  }

  const raw = `${dateStr} ${normalizedTime}`.trim();
  let d = new Date(raw);
  if (!isNaN(d.getTime())) return d;
  d = new Date(`${dateStr}T${normalizedTime}`);
  if (!isNaN(d.getTime())) return d;
  d = new Date(dateStr);
  return isNaN(d.getTime()) ? undefined : d;
}

function mapFlightToSegments(flight: any): any[] {
  if (!flight || typeof flight !== 'object') return [];
  const dep = flight.departure;
  const arr = flight.arrival;
  const departureAt = combinePointDateTime(dep?.date, dep?.time);
  const arrivalAt = combinePointDateTime(arr?.date, arr?.time);
  return [
    {
      airline: flight.airline,
      flightNo: flight.flightNumber || flight.flightNo,
      origin: dep?.airportCode || dep?.airport,
      destination: arr?.airportCode || arr?.airport,
      departureAt,
      arrivalAt,
      cabinClass: flight.cabinClass,
    },
  ];
}

function mapPassengers(raw: any[]): any[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((p) => ({
    firstName: p.firstName,
    lastName: p.lastName,
    birthDate: p.birthDate,
    gender: p.gender,
    nationality: p.nationality,
    tcNo: p.tcNo || p.citizenNo,
    citizenNoSha256: p.citizenNoSha256,
    passportNo: p.passportNo,
    passportCountry: p.passportCountry,
    passportValidDate: p.passportValidDate,
    idType: p.idType,
    email: p.email,
    phone: p.phone,
    passengerType: p.passengerType ?? p.type,
  }));
}

function mapPayment(doc: any): any {
  const pay = doc.payment;
  const fallbackAmount =
    (typeof doc.totalAmount === 'number' ? doc.totalAmount : undefined) ??
    (typeof doc.totalFare === 'number' ? doc.totalFare : undefined) ??
    (pay && typeof pay.amount === 'number' ? pay.amount : 0);

  let method: string | undefined;
  if (pay) {
    if (pay.cardNumber || pay.cardHolder) method = 'credit_card';
    else if (pay.bankName) method = 'bank_transfer';
    else if (pay.paymentId || pay.amount != null) method = 'credit_card';
  }
  if (!method && fallbackAmount > 0) method = 'credit_card';

  const transactionId = pay?.transactionId ?? pay?.paymentId;
  let paidAt: Date | undefined;
  if (pay?.paidAt) paidAt = new Date(pay.paidAt);
  else if (pay?.finalizedDate) paidAt = new Date(pay.finalizedDate);

  const amount =
    pay && typeof pay.amount === 'number' ? pay.amount : fallbackAmount;
  const currency = doc.currency ?? pay?.currency ?? 'TRY';

  return {
    method,
    transactionId,
    paidAt,
    amount,
    currency,
  };
}

function normalizeType(t?: string): string {
  if (!t) return 'flight';
  const lower = String(t).toLowerCase();
  if (lower === 'car') return 'car_rental';
  if (lower === 'hotel') return 'hotel';
  return lower;
}

function normalizeStatus(s?: string): string {
  if (!s) return 'pending';
  const u = String(s).toUpperCase();
  if (u === 'CONFIRMED') return 'confirmed';
  if (u === 'PENDING') return 'pending';
  if (u === 'CANCELLED' || u === 'CANCELED') return 'cancelled';
  if (u === 'COMPLETED') return 'completed';
  if (u === 'PAYMENT_FAILED') return 'payment_failed';
  return String(s).toLowerCase();
}

export function normalizeReservationDoc(
  doc: any,
  member?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  } | null,
): any {
  if (!doc) return doc;

  const reservationNo = doc.reservationNo || doc.bookingCode || '';
  const segments =
    Array.isArray(doc.segments) && doc.segments.length > 0
      ? doc.segments
      : mapFlightToSegments(doc.flight);

  const passengers = mapPassengers(doc.passengers || []);

  const payment = mapPayment(doc);

  let memberFirstName = doc.memberFirstName;
  let memberLastName = doc.memberLastName;
  let memberEmail = doc.memberEmail;
  let memberPhone = doc.memberPhone;

  if (member) {
    memberFirstName = memberFirstName || member.firstName;
    memberLastName = memberLastName || member.lastName;
    memberEmail = memberEmail || member.email;
    memberPhone = memberPhone || member.phone;
  }

  /** Üye kaydı yoksa veya snapshot yoksa listede ilk yolcuyu göster (client-api PAYMENT_FAILED vb.) */
  if (!String(memberFirstName || '').trim() && passengers.length > 0) {
    const p0 = passengers[0];
    if (p0?.firstName) {
      memberFirstName = p0.firstName;
      memberLastName = p0.lastName || '';
    }
  }

  /** İletişim: üye tablosunda boşsa lead yolcunun e-posta / telefonu (rezervasyon formu) */
  if (passengers.length > 0) {
    const p0 = passengers[0] as {
      email?: string;
      phone?: string;
    };
    if (!String(memberEmail || '').trim() && p0?.email) {
      memberEmail = p0.email;
    }
    if (!String(memberPhone || '').trim() && p0?.phone) {
      memberPhone = p0.phone;
    }
  }

  const totalAmount =
    typeof doc.totalAmount === 'number' && !isNaN(doc.totalAmount)
      ? doc.totalAmount
      : typeof doc.totalFare === 'number' && !isNaN(doc.totalFare)
        ? doc.totalFare
        : typeof payment.amount === 'number'
          ? payment.amount
          : 0;

  return {
    ...doc,
    reservationNo,
    type: normalizeType(doc.type),
    status: normalizeStatus(doc.status),
    segments,
    passengers,
    payment,
    totalAmount,
    currency: doc.currency || payment.currency || 'TRY',
    memberFirstName: memberFirstName || '',
    memberLastName: memberLastName || '',
    memberEmail: memberEmail || '',
    memberPhone: memberPhone || '',
  };
}

/** İstatistik ve filtre için DB sorgusunda kullanılacak status eşlemesi */
export function statusFilterValues(uiStatus: string): string[] {
  const s = uiStatus.toLowerCase();
  switch (s) {
    case 'confirmed':
      return ['confirmed', 'CONFIRMED'];
    case 'pending':
      return ['pending', 'PENDING'];
    case 'cancelled':
      return ['cancelled', 'CANCELLED', 'CANCELED'];
    case 'completed':
      return ['completed', 'COMPLETED'];
    case 'payment_failed':
      return ['PAYMENT_FAILED', 'payment_failed'];
    default:
      return [uiStatus];
  }
}
