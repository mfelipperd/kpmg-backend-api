import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../domain/services/email.service';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class NodemailerEmailService implements EmailService {
  constructor(
    private readonly mailer: MailerService,
    private readonly config: ConfigService,
    private readonly emailTemplate: EmailTemplateService,
  ) {}

  async sendCompanyNotificationEmail(
    company: {
      name: string;
      cnpj: string;
      tradeName: string;
      address: string;
    },
    recipients: string[],
  ): Promise<void> {
    if (!recipients.length) {
      console.warn('Nenhum destinatário encontrado!');
      return;
    }

    const htmlTemplate = this.emailTemplate.generateCompanyNotificationTemplate(company);

    await this.mailer.sendMail({
      from: `"Company API" <${this.config.get('EMAIL_USER')}>`,
      to: recipients,
      subject: `🏢 Nova empresa cadastrada: ${company.name}`,
      text: `Empresa "${company.name}" (CNPJ: ${company.cnpj}) foi cadastrada com sucesso no sistema!`,
      html: htmlTemplate,
    });
  }

  async sendEmailConfirmation(email: string): Promise<void> {
    const htmlTemplate = this.emailTemplate.generateEmailConfirmationTemplate(email);
    
    await this.mailer.sendMail({
      to: email,
      subject: '✅ E-mail cadastrado com sucesso - Company API',
      text: `Seu e-mail foi cadastrado com sucesso no sistema. Você receberá notificações sobre novas empresas cadastradas.`,
      html: htmlTemplate,
    });
  }

}
