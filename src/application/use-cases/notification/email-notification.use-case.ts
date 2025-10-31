import { Injectable, Inject } from "@nestjs/common";

import { Company } from "../../../domain/entities/company.entity";
import { EmailRecipient } from "../../../domain/entities/email-recipient.entity";
import { EmailService } from "../../../domain/services/email.service";
import { NotificationResult } from "src/domain/services/notification.service";

@Injectable()
export class EmailNotificationUseCase {
  constructor(
    @Inject("EmailService")
    private readonly emailService: EmailService
  ) {}

  async notifyCompanyCreated(
    company: Company,
    recipients: EmailRecipient[]
  ): Promise<NotificationResult> {
    try {
      if (recipients.length === 0) {
        return {
          success: true,
          message: "Nenhum destinatário ativo encontrado",
        };
      }

      const recipientEmails = recipients.map((r) => r.email);
      await this.emailService.sendCompanyNotificationEmail(
        company,
        recipientEmails
      );

      return {
        success: true,
        message: `Notificação enviada para ${recipients.length} destinatário(s)`,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao enviar notificação",
      };
    }
  }

  async notifyEmailConfirmation(email: string): Promise<NotificationResult> {
    try {
      await this.emailService.sendEmailConfirmation(email);

      return {
        success: true,
        message: "E-mail de confirmação enviado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao enviar confirmação",
      };
    }
  }
}
