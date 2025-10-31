import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "../../domain/services/email.service";
import { EmailTemplateService } from "./email-template.service";
import { Company } from "../../domain/entities/company.entity";

@Injectable()
export class NodemailerEmailService implements EmailService {
  private readonly logger = new Logger(NodemailerEmailService.name);

  constructor(
    private readonly mailer: MailerService,
    private readonly config: ConfigService,
    private readonly emailTemplate: EmailTemplateService,
  ) {}

  async sendCompanyNotificationEmail(
    company:
      | Company
      | {
          name: string;
          cnpj: string;
          tradeName: string;
          address: string;
        },
    recipients: string[],
  ): Promise<void> {
    if (!recipients.length) {
      this.logger.warn("Nenhum destinatário encontrado!");
      return;
    }

    if (!this.isEmailConfigured()) {
      this.logger.warn(
        "Credenciais de e-mail não configuradas. E-mail não será enviado.",
      );
      throw new Error(
        "Serviço de e-mail não configurado. Configure EMAIL_USER e EMAIL_PASS nas variáveis de ambiente.",
      );
    }

    const companyData = {
      name: company.name,
      cnpj: company.cnpj,
      tradeName: company.tradeName,
      address: company.address,
      favorite: "favorite" in company ? company.favorite : undefined,
      createdAt: "createdAt" in company ? company.createdAt : undefined,
    };

    const htmlTemplate =
      this.emailTemplate.generateCompanyNotificationTemplate(companyData);

    const emailUser =
      this.config.get<string>("EMAIL_USER") || "noreply@companyapi.com";

    try {
      await this.mailer.sendMail({
        from: `"Company API" <${emailUser}>`,
        to: recipients,
        subject: `Nova empresa cadastrada: ${company.name}`,
        text: `Empresa "${company.name}" (CNPJ: ${company.cnpj}) foi cadastrada com sucesso no sistema!`,
        html: htmlTemplate,
      });
      this.logger.log(
        `E-mail de notificação enviado para ${recipients.length} destinatário(s)`,
      );
    } catch (error) {
      this.logger.error(
        `Erro ao enviar e-mail de notificação: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async sendEmailConfirmation(email: string): Promise<void> {
    if (!this.isEmailConfigured()) {
      this.logger.warn(
        "Credenciais de e-mail não configuradas. E-mail de confirmação não será enviado.",
      );
      throw new Error(
        "Serviço de e-mail não configurado. Configure EMAIL_USER e EMAIL_PASS nas variáveis de ambiente.",
      );
    }

    const htmlTemplate =
      this.emailTemplate.generateEmailConfirmationTemplate(email);

    try {
      await this.mailer.sendMail({
        to: email,
        subject: "E-mail cadastrado com sucesso - Company API",
        text: `Seu e-mail foi cadastrado com sucesso no sistema. Você receberá notificações sobre novas empresas cadastradas.`,
        html: htmlTemplate,
      });
      this.logger.log(`E-mail de confirmação enviado para: ${email}`);
    } catch (error) {
      this.logger.error(
        `Erro ao enviar e-mail de confirmação: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  private isEmailConfigured(): boolean {
    const emailUser = this.config.get<string>("EMAIL_USER");
    const emailPass = this.config.get<string>("EMAIL_PASS");
    return !!(emailUser && emailPass);
  }
}
