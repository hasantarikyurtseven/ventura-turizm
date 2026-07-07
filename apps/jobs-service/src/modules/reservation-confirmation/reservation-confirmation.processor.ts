import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from '../email/email.service';
import { ReservationConfirmationTemplateParams } from '../email/templates/reservation-confirmation.template';

export interface ReservationConfirmationJobData extends ReservationConfirmationTemplateParams {
  contactEmail: string;
}

@Processor('reservation-confirmation')
export class ReservationConfirmationProcessor extends WorkerHost {
  private readonly logger = new Logger(ReservationConfirmationProcessor.name);

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<ReservationConfirmationJobData>): Promise<void> {
    const { contactEmail, ...params } = job.data;
    this.logger.log(
      `Rezervasyon onay maili işleniyor: ${contactEmail} | PNR: ${params.bookingCode} (jobId: ${job.id})`,
    );

    await this.emailService.sendReservationConfirmation(contactEmail, params);

    this.logger.log(
      `Rezervasyon onay maili tamamlandı: ${contactEmail} | PNR: ${params.bookingCode} (jobId: ${job.id})`,
    );
  }
}
