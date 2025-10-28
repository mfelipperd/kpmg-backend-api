import { Injectable, ConflictException, Inject, Logger } from "@nestjs/common";
import { EmailRecipient } from "../../../domain/entities/email-recipient.entity";
import { EmailRecipientRepository } from "../../../domain/repositories/email-recipient.repository";
import { EmailService } from "../../../domain/services/email.service";

export interface CreateEmailRecipientRequest {
  email: string;
  active?: boolean;
}

@Injectable()
export class CreateEmailRecipientUseCase {
  private readonly logger = new Logger(CreateEmailRecipientUseCase.name);

  constructor(
    @Inject("EmailRecipientRepository")
    private readonly emailRecipientRepository: EmailRecipientRepository,
    @Inject("EmailService")
    private readonly emailService: EmailService,
  ) {}

  async execute(request: CreateEmailRecipientRequest): Promise<EmailRecipient> {
    const normalizedEmail = request.email.trim().toLowerCase();
    this.logger.log(
      `Cadastrando novo destinatário de e-mail: ${normalizedEmail}`,
    );

    const existingRecipient =
      await this.emailRecipientRepository.findByEmail(normalizedEmail);
    if (existingRecipient) {
      this.logger.warn(
        `Tentativa de cadastrar e-mail já existente: ${normalizedEmail}`,
      );
      throw new ConflictException("Este e-mail já está cadastrado");
    }

    const emailRecipient = EmailRecipient.create(
      normalizedEmail,
      request.active,
    );
    const savedRecipient =
      await this.emailRecipientRepository.create(emailRecipient);

    this.logger.log(
      `E-mail cadastrado com sucesso: ID ${savedRecipient.id} - ${normalizedEmail}`,
    );

    try {
      await this.emailService.sendEmailConfirmation(normalizedEmail);
      this.logger.log(`E-mail de confirmação enviado para: ${normalizedEmail}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Erro ao enviar e-mail de confirmação para ${normalizedEmail}: ${errorMessage}`,
        error instanceof Error ? error.stack : undefined,
      );
    }

    return savedRecipient;
  }
}
