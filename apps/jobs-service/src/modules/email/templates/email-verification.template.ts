/**
 * Ventura Turizm – E-posta Doğrulama Mail Şablonu
 *
 * Kullanıcı kayıt olduktan sonra gönderilen onay e-postası.
 * Base layout'u kullanır; Ventura Turizm marka renkleri uygulanır.
 */

import { renderBaseLayout } from './base.layout';

export interface EmailVerificationTemplateParams {
  firstName: string;
  verifyUrl: string;
}

export function renderEmailVerificationTemplate(params: EmailVerificationTemplateParams): string {
  const { firstName, verifyUrl } = params;

  const body = `
    <!-- Greeting -->
    <h2 style="color:#183641;margin:0 0 8px;font-size:22px;font-weight:700;">
      Merhaba ${firstName} 👋
    </h2>
    <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px;">
      Ventura Turizm ailesine hoş geldiniz! Hesabınızı aktif hale getirmek ve
      tüm hizmetlerimizden yararlanabilmek için e-posta adresinizi doğrulamanız gerekmektedir.
    </p>

    <!-- Info Box -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin:0 0 28px;">
      <tr>
        <td style="background-color:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="36" valign="top" style="padding-right:12px;">
                <div style="width:32px;height:32px;background:linear-gradient(135deg,#183641,#4088b3);border-radius:50%;text-align:center;line-height:32px;font-size:16px;">
                  ✉️
                </div>
              </td>
              <td valign="top">
                <p style="color:#183641;font-size:14px;font-weight:600;margin:0 0 4px;">Doğrulama Gerekli</p>
                <p style="color:#64748b;font-size:13px;line-height:1.5;margin:0;">
                  Aşağıdaki butona tıklayarak e-posta adresinizi onaylayın. Bu link <strong style="color:#183641;">24 saat</strong> geçerlidir.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding:4px 0 32px;">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
            href="${verifyUrl}" style="height:50px;v-text-anchor:middle;width:260px;" arcsize="16%"
            strokecolor="#183641" fillcolor="#183641">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">
              E-postamı Doğrula
            </center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <a href="${verifyUrl}" class="cta-button"
             style="display:inline-block;background:linear-gradient(135deg,#183641 0%,#2d6a8a 50%,#4088b3 100%);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 44px;border-radius:10px;letter-spacing:0.3px;box-shadow:0 4px 12px rgba(24,54,65,0.25);transition:all 0.2s;">
            ✓ &nbsp;E-postamı Doğrula
          </a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>

    <!-- Fallback URL -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin:0 0 28px;">
      <tr>
        <td style="background-color:#f8fafc;border-radius:8px;padding:16px 20px;border:1px solid #e2e8f0;">
          <p style="color:#64748b;font-size:12px;line-height:1.5;margin:0 0 6px;">
            Buton çalışmıyorsa aşağıdaki linki kopyalayıp tarayıcınıza yapıştırın:
          </p>
          <p style="margin:0;word-break:break-all;">
            <a href="${verifyUrl}" style="color:#4088b3;font-size:12px;text-decoration:underline;">${verifyUrl}</a>
          </p>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 20px;" />

    <!-- Benefits Teaser -->
    <p style="color:#183641;font-size:14px;font-weight:600;margin:0 0 12px;">
      Üyelik Avantajlarınız:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:4px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="24" valign="top" style="color:#22c55e;font-size:14px;padding-right:8px;">✓</td>
              <td style="color:#475569;font-size:13px;line-height:1.5;">Özel kampanya ve fırsatlardan ilk siz haberdar olun</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:4px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="24" valign="top" style="color:#22c55e;font-size:14px;padding-right:8px;">✓</td>
              <td style="color:#475569;font-size:13px;line-height:1.5;">Hızlı rezervasyon ve kolay ödeme seçenekleri</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:4px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="24" valign="top" style="color:#22c55e;font-size:14px;padding-right:8px;">✓</td>
              <td style="color:#475569;font-size:13px;line-height:1.5;">Puan biriktirin ve ödüllere dönüştürün</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Security Notice -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin:24px 0 0;">
      <tr>
        <td style="background-color:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:14px 18px;">
          <p style="color:#92400e;font-size:12px;line-height:1.5;margin:0;">
            🔒 <strong>Güvenlik notu:</strong> Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı görmezden gelebilirsiniz. Hesap, e-posta doğrulanmadan aktif olmayacaktır.
          </p>
        </td>
      </tr>
    </table>
  `;

  return renderBaseLayout({
    body,
    footerExtra: 'Sorularınız için <a href="mailto:destek@venturaturizm.com" style="color:#4088b3;text-decoration:underline;">destek@venturaturizm.com</a> adresine yazabilirsiniz.',
  });
}
