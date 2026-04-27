import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from '../email/email.service';

export interface EmailVerificationJobData {
  email: string;
  firstName: string;
  verificationToken: string;
  clientWebUrl: string;
}

@Processor('email-verification')
export class EmailVerificationProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailVerificationProcessor.name);

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<EmailVerificationJobData>): Promise<void> {
    const { email, firstName, verificationToken, clientWebUrl } = job.data;
    this.logger.log(`E-posta doğrulama job'u işleniyor: ${email} (jobId: ${job.id})`);

    await this.emailService.sendVerificationEmail(
      email,
      firstName,
      verificationToken,
      clientWebUrl,
    );

    this.logger.log(`E-posta doğrulama job'u tamamlandı: ${email} (jobId: ${job.id})`);
  }
}
