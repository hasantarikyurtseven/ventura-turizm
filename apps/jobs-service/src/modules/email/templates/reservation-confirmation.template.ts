/**
 * Ventura Turizm – Rezervasyon Onay Mail Şablonu
 *
 * Ödeme başarılı olup rezervasyon CONFIRMED statüsüne geçince
 * iletişim kişisine gönderilir.
 */

import { renderBaseLayout } from './base.layout';

export interface ReservationPassengerParam {
  firstName: string;
  lastName: string;
  type: string;
}

export interface ReservationFlightParam {
  airline: string;
  flightNumber: string;
  departure: { airportCode: string; time: string; date: string };
  arrival: { airportCode: string; time: string; date: string };
  duration?: string;
  brandName?: string;
  baggageDescription?: string;
  fare?: number;
  currency?: string;
}

export interface ReservationConfirmationTemplateParams {
  contactName: string;
  bookingCode: string;
  totalFare?: number;
  currency?: string;
  passengers: ReservationPassengerParam[];
  flight?: ReservationFlightParam | null;
  flightLegs?: ReservationFlightParam[];
  payment?: {
    cardHolder?: string;
    cardNumber?: string;
    bankName?: string;
    installmentCount?: number;
    finalizedDate?: string;
  };
}

function paxTypeLabel(type: string): string {
  if (type === 'CHD') return 'Çocuk';
  if (type === 'INF') return 'Bebek';
  return 'Yetişkin';
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
                  'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr.trim());
  if (!m) return dateStr;
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${m[1]}`;
}

function renderFlightRow(leg: ReservationFlightParam, label: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:12px;">
      <tr>
        <td style="background-color:#f0f7ff;border:1px solid #bde0ff;border-radius:10px;padding:16px 20px;">

          <!-- Bacak Etiketi -->
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;
                    letter-spacing:0.08em;color:#2d6a8a;">${label}</p>

          <!-- Rota -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <!-- Kalkış -->
              <td valign="top" width="28%">
                <p style="margin:0;font-size:32px;font-weight:900;color:#0f1923;line-height:1;letter-spacing:-0.03em;">
                  ${leg.departure.airportCode}
                </p>
                <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#2d6a8a;">${leg.departure.time}</p>
                <p style="margin:2px 0 0;font-size:11px;color:#64748b;">${formatDate(leg.departure.date)}</p>
              </td>

              <!-- Orta -->
              <td valign="middle" align="center" width="44%"
                  style="padding:4px 8px;">
                <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1;">──── ✈ ────</p>
                <p style="margin:4px 0 0;font-size:11px;font-weight:600;color:#183641;">
                  ${leg.airline} &bull; ${leg.flightNumber}
                </p>
                ${leg.duration ? `<p style="margin:2px 0 0;font-size:11px;color:#94a3b8;">${leg.duration}</p>` : ''}
              </td>

              <!-- Varış -->
              <td valign="top" width="28%" align="right">
                <p style="margin:0;font-size:32px;font-weight:900;color:#0f1923;line-height:1;letter-spacing:-0.03em;">
                  ${leg.arrival.airportCode}
                </p>
                <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#2d6a8a;">${leg.arrival.time}</p>
                <p style="margin:2px 0 0;font-size:11px;color:#64748b;">${formatDate(leg.arrival.date)}</p>
              </td>
            </tr>
          </table>

          <!-- Kabin / Bagaj -->
          ${leg.brandName || leg.baggageDescription ? `
          <p style="margin:10px 0 0;font-size:12px;color:#475569;">
            ${leg.brandName ? `<strong style="color:#183641;">${leg.brandName}</strong>` : ''}
            ${leg.baggageDescription ? `&nbsp;&bull;&nbsp;🧳 ${leg.baggageDescription}` : ''}
          </p>
          ` : ''}

        </td>
      </tr>
    </table>
  `;
}

function renderPassengers(passengers: ReservationPassengerParam[]): string {
  const rows = passengers.map((p, i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;font-weight:600;color:#0f1923;">
        ${i + 1}. ${p.firstName.toUpperCase()} ${p.lastName.toUpperCase()}
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;text-align:right;">
        ${paxTypeLabel(p.type)}
      </td>
    </tr>
  `).join('');

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="1"
           style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr>
        <th style="background-color:#f8fafc;padding:8px 12px;text-align:left;font-size:11px;
                   text-transform:uppercase;letter-spacing:0.08em;color:#64748b;font-weight:600;
                   border-bottom:1px solid #e2e8f0;">
          Yolcu Adı
        </th>
        <th style="background-color:#f8fafc;padding:8px 12px;text-align:right;font-size:11px;
                   text-transform:uppercase;letter-spacing:0.08em;color:#64748b;font-weight:600;
                   border-bottom:1px solid #e2e8f0;">
          Tip
        </th>
      </tr>
      ${rows}
    </table>
  `;
}

export function renderReservationConfirmationTemplate(
  params: ReservationConfirmationTemplateParams,
): string {
  const { contactName, bookingCode, totalFare, currency, passengers, flight, flightLegs, payment } = params;

  const legs: Array<{ leg: ReservationFlightParam; label: string }> = [];
  if (flightLegs && flightLegs.length > 1) {
    flightLegs.forEach((l, i) =>
      legs.push({ leg: l, label: i === 0 ? '✈ Gidiş' : '✈ Dönüş' }),
    );
  } else if (flight) {
    legs.push({ leg: flight, label: '✈ Uçuş' });
  }

  const flightSection = legs.map(({ leg, label }) => renderFlightRow(leg, label)).join('');

  const body = `
    <!-- Başarı İkonu -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:24px;">
      <tr>
        <td align="center">
          <div style="width:64px;height:64px;background:linear-gradient(135deg,#16a34a,#22c55e);
                      border-radius:50%;text-align:center;line-height:64px;font-size:28px;
                      margin:0 auto 12px;">
            ✓
          </div>
          <h2 style="color:#183641;margin:0 0 6px;font-size:22px;font-weight:800;">
            Rezervasyonunuz Onaylandı!
          </h2>
          <p style="color:#475569;font-size:14px;line-height:1.6;margin:0;">
            Merhaba <strong>${contactName}</strong>, biletiniz başarıyla satın alındı.
          </p>
        </td>
      </tr>
    </table>

    <!-- PNR Kutusu -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:28px;">
      <tr>
        <td style="background:linear-gradient(135deg,#183641 0%,#2d6a8a 60%,#4088b3 100%);
                   border-radius:12px;padding:20px 24px;text-align:center;">
          <p style="color:rgba(255,255,255,0.7);font-size:11px;text-transform:uppercase;
                    letter-spacing:0.12em;margin:0 0 6px;">Rezervasyon Kodu (PNR)</p>
          <p style="color:#ffffff;font-size:36px;font-weight:900;letter-spacing:0.2em;
                    margin:0;font-family:'Courier New',Courier,monospace;">
            ${bookingCode}
          </p>
          ${totalFare ? `
          <p style="color:rgba(255,255,255,0.85);font-size:18px;font-weight:700;margin:10px 0 0;">
            Toplam: ${totalFare.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${currency || 'TRY'}
          </p>
          ` : ''}
        </td>
      </tr>
    </table>

    <!-- Uçuş Bilgileri -->
    <p style="color:#183641;font-size:14px;font-weight:700;margin:0 0 12px;
              text-transform:uppercase;letter-spacing:0.06em;">
      ✈ Uçuş Bilgileri
    </p>
    ${flightSection}

    <!-- Yolcular -->
    <p style="color:#183641;font-size:14px;font-weight:700;margin:0 0 12px;
              text-transform:uppercase;letter-spacing:0.06em;">
      👤 Yolcular (${passengers.length} kişi)
    </p>
    ${renderPassengers(passengers)}

    ${payment?.cardHolder ? `
    <!-- Ödeme Bilgisi -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:24px;">
      <tr>
        <td style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;">
          <p style="color:#183641;font-size:13px;font-weight:700;margin:0 0 10px;
                    text-transform:uppercase;letter-spacing:0.06em;">💳 Ödeme Bilgisi</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            ${payment.cardHolder ? `
            <tr>
              <td style="font-size:12px;color:#64748b;padding:3px 0;width:120px;">Kart Sahibi</td>
              <td style="font-size:12px;font-weight:600;color:#0f1923;padding:3px 0;">${payment.cardHolder}</td>
            </tr>` : ''}
            ${payment.cardNumber ? `
            <tr>
              <td style="font-size:12px;color:#64748b;padding:3px 0;">Kart No</td>
              <td style="font-size:12px;font-weight:600;color:#0f1923;padding:3px 0;">**** **** **** ${payment.cardNumber.slice(-4)}</td>
            </tr>` : ''}
            ${payment.bankName ? `
            <tr>
              <td style="font-size:12px;color:#64748b;padding:3px 0;">Banka</td>
              <td style="font-size:12px;font-weight:600;color:#0f1923;padding:3px 0;">${payment.bankName}</td>
            </tr>` : ''}
            ${payment.installmentCount && payment.installmentCount > 1 ? `
            <tr>
              <td style="font-size:12px;color:#64748b;padding:3px 0;">Taksit</td>
              <td style="font-size:12px;font-weight:600;color:#0f1923;padding:3px 0;">${payment.installmentCount} taksit</td>
            </tr>` : ''}
            ${payment.finalizedDate ? `
            <tr>
              <td style="font-size:12px;color:#64748b;padding:3px 0;">İşlem Tarihi</td>
              <td style="font-size:12px;font-weight:600;color:#0f1923;padding:3px 0;">${payment.finalizedDate}</td>
            </tr>` : ''}
          </table>
        </td>
      </tr>
    </table>
    ` : ''}

    <!-- Ayırıcı -->
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;" />

    <!-- Sonraki Adımlar -->
    <p style="color:#183641;font-size:14px;font-weight:700;margin:0 0 16px;
              text-transform:uppercase;letter-spacing:0.06em;">
      📋 Uçuşunuzdan Önce Yapmanız Gerekenler
    </p>

    <!-- Adım 1 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:10px;">
      <tr>
        <td style="background-color:#f0f7ff;border-left:4px solid #4088b3;
                   border-radius:0 8px 8px 0;padding:14px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="top" style="padding-right:12px;">
                <div style="width:28px;height:28px;background:#4088b3;border-radius:50%;
                            text-align:center;line-height:28px;color:#fff;font-size:13px;font-weight:800;">1</div>
              </td>
              <td valign="top">
                <p style="color:#183641;font-size:13px;font-weight:700;margin:0 0 3px;">
                  PNR Kodunuzu Kaydedin
                </p>
                <p style="color:#475569;font-size:12px;line-height:1.6;margin:0;">
                  Rezervasyon kodunuz (PNR): <strong style="color:#183641;letter-spacing:0.1em;">${bookingCode}</strong>.
                  Bu kodu uçuşa kadar güvenli bir yerde saklayın; havalimanında check-in ve her türlü işlemde kullanacaksınız.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Adım 2 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:10px;">
      <tr>
        <td style="background-color:#f0f7ff;border-left:4px solid #4088b3;
                   border-radius:0 8px 8px 0;padding:14px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="top" style="padding-right:12px;">
                <div style="width:28px;height:28px;background:#4088b3;border-radius:50%;
                            text-align:center;line-height:28px;color:#fff;font-size:13px;font-weight:800;">2</div>
              </td>
              <td valign="top">
                <p style="color:#183641;font-size:13px;font-weight:700;margin:0 0 3px;">
                  Online Check-in Yapın (Zorunlu)
                </p>
                <p style="color:#475569;font-size:12px;line-height:1.6;margin:0;">
                  Havayolu şirketinin <strong style="color:#183641;">kendi web sitesine</strong> giderek
                  PNR kodunuz ile online check-in işlemini tamamlayın.
                  Online check-in genellikle <strong style="color:#183641;">uçuştan 24–48 saat önce</strong> açılır,
                  kalkıştan <strong style="color:#183641;">1 saat öncesine</strong> kadar yapılabilir.
                  Bu işlemi tamamlamazsanız havalimanında ek ücret veya bekleme süresiyle karşılaşabilirsiniz.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Adım 3 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:10px;">
      <tr>
        <td style="background-color:#f0f7ff;border-left:4px solid #4088b3;
                   border-radius:0 8px 8px 0;padding:14px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="top" style="padding-right:12px;">
                <div style="width:28px;height:28px;background:#4088b3;border-radius:50%;
                            text-align:center;line-height:28px;color:#fff;font-size:13px;font-weight:800;">3</div>
              </td>
              <td valign="top">
                <p style="color:#183641;font-size:13px;font-weight:700;margin:0 0 3px;">
                  Uçuş Bilgilerinizi Teyit Edin
                </p>
                <p style="color:#475569;font-size:12px;line-height:1.6;margin:0;">
                  Kalkış saatleri zaman zaman değişebilir. Uçuş gününden en az
                  <strong style="color:#183641;">24 saat önce</strong> havayolu şirketinin
                  web sitesi veya mobil uygulamasından güncel kalkış saatini kontrol edin.
                  Uçuş numaranızla anlık durum takibi yapabilirsiniz.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Adım 4 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:10px;">
      <tr>
        <td style="background-color:#f0f7ff;border-left:4px solid #4088b3;
                   border-radius:0 8px 8px 0;padding:14px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="top" style="padding-right:12px;">
                <div style="width:28px;height:28px;background:#4088b3;border-radius:50%;
                            text-align:center;line-height:28px;color:#fff;font-size:13px;font-weight:800;">4</div>
              </td>
              <td valign="top">
                <p style="color:#183641;font-size:13px;font-weight:700;margin:0 0 3px;">
                  Havalimanına Erken Gidin
                </p>
                <p style="color:#475569;font-size:12px;line-height:1.6;margin:0;">
                  Yurt içi uçuşlarda en az <strong style="color:#183641;">1,5 saat</strong>,
                  yurt dışı uçuşlarda en az <strong style="color:#183641;">3 saat</strong>
                  önce havalimanında olmanızı öneririz. Pasaportunuzun veya kimlik kartınızın
                  geçerli olduğundan emin olun.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Adım 5 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:24px;">
      <tr>
        <td style="background-color:#f0f7ff;border-left:4px solid #4088b3;
                   border-radius:0 8px 8px 0;padding:14px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="top" style="padding-right:12px;">
                <div style="width:28px;height:28px;background:#4088b3;border-radius:50%;
                            text-align:center;line-height:28px;color:#fff;font-size:13px;font-weight:800;">5</div>
              </td>
              <td valign="top">
                <p style="color:#183641;font-size:13px;font-weight:700;margin:0 0 3px;">
                  Sorun Yaşarsanız Bize Ulaşın
                </p>
                <p style="color:#475569;font-size:12px;line-height:1.6;margin:0;">
                  Değişiklik, iptal veya herhangi bir sorun için
                  <a href="mailto:destek@venturaturizm.com" style="color:#4088b3;text-decoration:underline;">destek@venturaturizm.com</a>
                  adresine e-posta gönderin ya da müşteri hizmetlerimizi arayın.
                  İletişime geçerken PNR kodunuzu hazır bulundurun.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Uyarı Notu -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="background-color:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:14px 18px;">
          <p style="color:#92400e;font-size:12px;line-height:1.7;margin:0;">
            ⚠️ <strong>Önemli Hatırlatma:</strong> Bu e-posta bir rezervasyon onayıdır, uçuş bileti değildir.
            Biniş kartınızı (boarding pass) online check-in sırasında havayolu şirketinin sitesinden alabilirsiniz.
            Elektronik biletiniz (e-ticket) havayolu tarafından ayrıca gönderilecektir.
          </p>
        </td>
      </tr>
    </table>
  `;

  return renderBaseLayout({
    body,
    footerExtra:
      'Rezervasyonunuzla ilgili sorularınız için <a href="mailto:destek@venturaturizm.com" style="color:#4088b3;text-decoration:underline;">destek@venturaturizm.com</a> adresine yazabilirsiniz.',
  });
}
