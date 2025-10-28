import { Injectable, ConflictException, Inject } from "@nestjs/common";
import { EmailRecipient } from "../../../domain/entities/email-recipient.entity";
import { EmailRecipientRepository } from "../../../domain/repositories/email-recipient.repository";
import { EmailService } from "../../../domain/services/email.service";

export interface CreateEmailRecipientRequest {
  email: string;
  active?: boolean;
}

@Injectable()
export class CreateEmailRecipientUseCase {
  constructor(
    @Inject("EmailRecipientRepository")
    private readonly emailRecipientRepository: EmailRecipientRepository,
    @Inject("EmailService")
    private readonly emailService: EmailService,
  ) {}

  async execute(request: CreateEmailRecipientRequest): Promise<EmailRecipient> {
    const normalizedEmail = request.email.trim().toLowerCase();

    const existingRecipient =
      await this.emailRecipientRepository.findByEmail(normalizedEmail);
    if (existingRecipient) {
      throw new ConflictException("Este e-mail já está cadastrado");
    }

    const emailRecipient = EmailRecipient.create(
      normalizedEmail,
      request.active,
    );
    const savedRecipient =
      await this.emailRecipientRepository.create(emailRecipient);

    try {
      await this.emailService.sendEmailConfirmation(normalizedEmail);
    } catch (error) {
      console.error("Erro ao enviar e-mail de confirmação:", error);
    }

    return savedRecipient;
  }
}
