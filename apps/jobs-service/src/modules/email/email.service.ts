import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { renderEmailVerificationTemplate } from './templates/email-verification.template';
import {
  renderReservationConfirmationTemplate,
  ReservationConfirmationTemplateParams,
} from './templates/reservation-confirmation.template';
import {
  renderContactFormAdminTemplate,
  renderContactFormUserTemplate,
  ContactFormTemplateParams,
} from './templates/contact-form.template';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = parseInt(this.configService.get<string>('SMTP_PORT', '465'), 10);
    const secure = this.configService.get<string>('SMTP_SECURE', 'ssl');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: secure === 'ssl' || secure === 'true' || port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    });

    this.logger.log(`SMTP transporter oluşturuldu: ${host}:${port}`);
  }

  /**
   * E-posta doğrulama maili gönder
   * Şablon: templates/email-verification.template.ts
   */
  async sendVerificationEmail(
    to: string,
    firstName: string,
    verificationToken: string,
    clientWebUrl: string,
  ): Promise<void> {
    const from = this.configService.get<string>('SMTP_FROM', 'noreply@venturaturizm.com');
    const verifyUrl = `${clientWebUrl}/verify-email?token=${verificationToken}`;

    const html = renderEmailVerificationTemplate({ firstName, verifyUrl });

    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject: 'Ventura Turizm – E-posta Adresinizi Doğrulayın',
        html,
      });
      this.logger.log(`Doğrulama e-postası gönderildi: ${to} (messageId: ${info.messageId})`);
    } catch (error) {
      this.logger.error(`E-posta gönderilemedi: ${to}`, error?.stack || error);
      throw error;
    }
  }

  /**
   * Rezervasyon onay maili gönder
   */
  async sendReservationConfirmation(
    to: string,
    params: ReservationConfirmationTemplateParams,
  ): Promise<void> {
    const from = this.configService.get<string>('SMTP_FROM', 'noreply@venturaturizm.com');
    const html = renderReservationConfirmationTemplate(params);

    try {
      const info = await this.transporter.sendMail({
        from, to,
        subject: `Ventura Turizm – Rezervasyon Onayı: ${params.bookingCode}`,
        html,
      });
      this.logger.log(`Rezervasyon onay maili gönderildi: ${to} (messageId: ${info.messageId})`);
    } catch (error) {
      this.logger.error(`Rezervasyon onay maili gönderilemedi: ${to}`, error?.stack || error);
      throw error;
    }
  }

  async sendContactFormEmails(params: ContactFormTemplateParams): Promise<void> {
    const from = this.configService.get<string>('SMTP_FROM', 'noreply@venturaturizm.com');
    const adminEmail = this.configService.get<string>('CONTACT_ADMIN_EMAIL', from);

    const adminHtml = renderContactFormAdminTemplate(params);
    const userHtml  = renderContactFormUserTemplate(params);

    try {
      await this.transporter.sendMail({
        from, to: adminEmail,
        subject: `Yeni İletişim Mesajı: ${params.subject}`,
        html: adminHtml,
        replyTo: params.email,
      });
      await this.transporter.sendMail({
        from, to: params.email,
        subject: 'Ventura Turizm – Mesajınız Alındı',
        html: userHtml,
      });
      this.logger.log(`İletişim formu mailleri gönderildi: ${params.email}`);
    } catch (error) {
      this.logger.error(`İletişim formu maili gönderilemedi`, error?.stack || error);
      throw error;
    }
  }
}
