/**
 * Ventura Turizm – Ortak E-posta Layout Şablonu
 *
 * Tüm e-posta şablonları bu layout'u kullanır.
 * Marka renkleri, tipografi ve yapı burada tanımlıdır.
 *
 * Renkler:
 *   Primary Dark : #183641
 *   Primary      : #4088b3
 *   Text         : #183641
 *   Text Muted   : #475569
 *   Text Light   : #64748b
 *   Text Faint   : #94a3b8
 *   Border       : #e2e8f0
 *   Surface      : #f8fafc
 *   Background   : #f4f7fa
 *   Success      : #22c55e
 *   Error        : #ef4444
 *   White        : #ffffff
 */

export interface BaseLayoutParams {
  /** E-posta ana içeriği (HTML) */
  body: string;
  /** Opsiyonel: alt bilgi ek metni */
  footerExtra?: string;
}

export function renderBaseLayout(params: BaseLayoutParams): string {
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="tr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Ventura Turizm</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset */
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }

    /* Responsive */
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .email-body-inner { padding: 24px 20px !important; }
      .email-header { padding: 24px 20px !important; }
      .email-footer { padding: 20px !important; }
      .cta-button { padding: 12px 28px !important; font-size: 15px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#183641;">

  <!-- Preheader (hidden, for mail client preview) -->
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Ventura Turizm
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#f4f7fa;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Email Container -->
        <table role="presentation" class="email-container" width="560" cellpadding="0" cellspacing="0" border="0"
               style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(24,54,65,0.08);">

          <!-- ============ HEADER ============ -->
          <tr>
            <td class="email-header"
                style="background:linear-gradient(135deg,#183641 0%,#4088b3 100%);padding:32px 40px;text-align:center;">
              <!-- Logo placeholder – text based -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:800;letter-spacing:1px;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
                      VENTURA TURİZM
                    </h1>
                    <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
                      Seyahat &bull; Keşfet &bull; Yaşa
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============ BODY ============ -->
          <tr>
            <td class="email-body-inner" style="padding:40px;">
              ${params.body}
            </td>
          </tr>

          <!-- ============ FOOTER ============ -->
          <tr>
            <td class="email-footer"
                style="background-color:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              ${params.footerExtra ? `<p style="color:#64748b;font-size:12px;line-height:1.5;margin:0 0 12px;">${params.footerExtra}</p>` : ''}
              <p style="color:#94a3b8;font-size:11px;line-height:1.5;margin:0;">
                &copy; ${year} Ventura Turizm A.Ş. Tüm hakları saklıdır.
              </p>
              <p style="color:#cbd5e1;font-size:11px;margin:8px 0 0;">
                Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Email Container -->

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}
