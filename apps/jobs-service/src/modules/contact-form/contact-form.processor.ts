import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from '../email/email.service';
import { ContactFormTemplateParams } from '../email/templates/contact-form.template';

@Processor('contact-form')
export class ContactFormProcessor extends WorkerHost {
  private readonly logger = new Logger(ContactFormProcessor.name);

  constructor(private readonly emailService: EmailService) { super(); }

  async process(job: Job<ContactFormTemplateParams>): Promise<void> {
    this.logger.log(`İletişim formu maili işleniyor: ${job.data.email}`);
    await this.emailService.sendContactFormEmails(job.data);
    this.logger.log(`İletişim formu maili tamamlandı: ${job.data.email}`);
  }
}
