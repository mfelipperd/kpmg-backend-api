import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { EmailRecipient } from '../../../domain/entities/email-recipient.entity';
import { EmailRecipientRepository } from '../../../domain/repositories/email-recipient.repository';

export interface UpdateEmailRecipientRequest {
  id: number;
  email?: string;
  active?: boolean;
}

@Injectable()
export class UpdateEmailRecipientUseCase {
  constructor(
    @Inject('EmailRecipientRepository')
    private readonly emailRecipientRepository: EmailRecipientRepository,
  ) {}

  async execute(request: UpdateEmailRecipientRequest): Promise<EmailRecipient> {
    const existingRecipient = await this.emailRecipientRepository.findById(request.id);
    if (!existingRecipient) {
      throw new NotFoundException('Destinatário de e-mail não encontrado');
    }

    const updatedRecipient = existingRecipient.update({
      email: request.email,
      active: request.active,
    });

    return this.emailRecipientRepository.update(request.id, updatedRecipient);
  }
}
