import { Injectable, ConflictException, Inject, Logger } from "@nestjs/common";
import { EmailRecipient } from "../../../domain/entities/email-recipient.entity";
import { EmailRecipientRepository } from "../../../domain/repositories/email-recipient.repository";
import { NotificationService } from "../../../domain/services/notification.service";

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
    @Inject("NotificationService")
    private readonly notificationService: NotificationService
  ) {}

  async execute(request: CreateEmailRecipientRequest): Promise<EmailRecipient> {
    const normalizedEmail = request.email.trim().toLowerCase();
    this.logger.log(
      `Cadastrando novo destinatário de e-mail: ${normalizedEmail}`
    );

    const existingRecipient =
      await this.emailRecipientRepository.findByEmail(normalizedEmail);
    if (existingRecipient) {
      this.logger.warn(
        `Tentativa de cadastrar e-mail já existente: ${normalizedEmail}`
      );
      throw new ConflictException("Este e-mail já está cadastrado");
    }

    const emailRecipient = EmailRecipient.create(
      normalizedEmail,
      request.active
    );
    const savedRecipient =
      await this.emailRecipientRepository.create(emailRecipient);

    this.logger.log(
      `E-mail cadastrado com sucesso: ID ${savedRecipient.id} - ${normalizedEmail}`
    );

    const notificationResult =
      await this.notificationService.notifyEmailConfirmation(normalizedEmail);
    if (!notificationResult.success) {
      this.logger.error(
        `Erro ao enviar e-mail de confirmação para ${normalizedEmail}: ${notificationResult.error}`
      );
    } else {
      this.logger.log(`E-mail de confirmação enviado para: ${normalizedEmail}`);
    }

    return savedRecipient;
  }
}
