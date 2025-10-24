import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { EmailRecipientRepository } from '../../../domain/repositories/email-recipient.repository';

@Injectable()
export class DeleteEmailRecipientUseCase {
  constructor(
    @Inject('EmailRecipientRepository')
    private readonly emailRecipientRepository: EmailRecipientRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const recipient = await this.emailRecipientRepository.findById(id);
    if (!recipient) {
      throw new NotFoundException('Destinatário de e-mail não encontrado');
    }

    await this.emailRecipientRepository.delete(id);
  }
}
