import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { renderEmailVerificationTemplate } from './templates/email-verification.template';

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
}
