import { Injectable, Inject } from '@nestjs/common';
import { EmailRecipient } from '../../../domain/entities/email-recipient.entity';
import { EmailRecipientRepository } from '../../../domain/repositories/email-recipient.repository';

@Injectable()
export class GetEmailRecipientsUseCase {
  constructor(
    @Inject('EmailRecipientRepository')
    private readonly emailRecipientRepository: EmailRecipientRepository,
  ) {}

  async execute(): Promise<EmailRecipient[]> {
    return this.emailRecipientRepository.findAll();
  }
}
