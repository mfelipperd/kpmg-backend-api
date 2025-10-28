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
    private readonly emailTemplate: EmailTemplateService
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
    recipients: string[]
  ): Promise<void> {
    if (!recipients.length) {
      this.logger.warn("Nenhum destinatário encontrado!");
      return;
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

    await this.mailer.sendMail({
      from: `"Company API" <${this.config.get("EMAIL_USER")}>`,
      to: recipients,
      subject: `Nova empresa cadastrada: ${company.name}`,
      text: `Empresa "${company.name}" (CNPJ: ${company.cnpj}) foi cadastrada com sucesso no sistema!`,
      html: htmlTemplate,
    });
  }

  async sendEmailConfirmation(email: string): Promise<void> {
    const htmlTemplate =
      this.emailTemplate.generateEmailConfirmationTemplate(email);

    await this.mailer.sendMail({
      to: email,
      subject: "E-mail cadastrado com sucesso - Company API",
      text: `Seu e-mail foi cadastrado com sucesso no sistema. Você receberá notificações sobre novas empresas cadastradas.`,
      html: htmlTemplate,
    });
  }
}
