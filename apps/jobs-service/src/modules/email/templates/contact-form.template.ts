import { renderBaseLayout } from './base.layout';

export interface ContactFormTemplateParams {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export function renderContactFormAdminTemplate(p: ContactFormTemplateParams): string {
  const body = `
    <h2 style="color:#183641;font-size:22px;font-weight:700;margin:0 0 8px;">Yeni İletişim Mesajı</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 24px;">Web sitesi iletişim formundan yeni bir mesaj alındı.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <tr><td style="padding:6px 0;font-size:14px;color:#183641;"><strong>Ad Soyad:</strong> ${p.name}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#183641;"><strong>E-posta:</strong> ${p.email}</td></tr>
      ${p.phone ? `<tr><td style="padding:6px 0;font-size:14px;color:#183641;"><strong>Telefon:</strong> ${p.phone}</td></tr>` : ''}
      <tr><td style="padding:6px 0;font-size:14px;color:#183641;"><strong>Konu:</strong> ${p.subject}</td></tr>
    </table>
    <h3 style="color:#183641;font-size:15px;font-weight:600;margin:0 0 10px;">Mesaj:</h3>
    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;font-size:14px;color:#475569;line-height:1.7;">
      ${p.message.replace(/\n/g, '<br>')}
    </div>
  `;
  return renderBaseLayout({ body, footerExtra: 'Bu mesaj Ventura Turizm web sitesi iletişim formundan iletilmiştir.' });
}

export function renderContactFormUserTemplate(p: ContactFormTemplateParams): string {
  const body = `
    <h2 style="color:#183641;font-size:22px;font-weight:700;margin:0 0 8px;">Mesajınız Alındı!</h2>
    <p style="color:#475569;font-size:15px;margin:0 0 20px;">Merhaba <strong>${p.name}</strong>,</p>
    <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 20px;">
      İletişim formunu doldurduğunuz için teşekkür ederiz. Mesajınız başarıyla tarafımıza iletildi.
      En kısa sürede size geri dönüş yapacağız.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <tr><td style="padding:4px 0;font-size:13px;color:#64748b;"><strong>Konu:</strong> ${p.subject}</td></tr>
    </table>
    <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">
      Sorularınız için <a href="mailto:info@venturaturizm.com" style="color:#4088b3;">info@venturaturizm.com</a>
      adresinden bize ulaşabilirsiniz.
    </p>
  `;
  return renderBaseLayout({ body, footerExtra: 'Bu e-posta otomatik olarak gönderilmiştir.' });
}
