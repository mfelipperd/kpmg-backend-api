import { Module } from '@nestjs/common';
import { PrismaCompanyRepository } from './database/repositories/prisma-company.repository';
import { PrismaEmailRecipientRepository } from './database/repositories/prisma-email-recipient.repository';
import { NodemailerEmailService } from './email/nodemailer-email.service';
import { PrismaService } from '../prisma.service';
import { EmailTemplateService } from './email/email-template.service';
import { BusinessValidationService } from './validation/business-validation.service';
import { EmailNotificationService } from './notification/email-notification.service';
import { CompanyDomainServiceImpl } from './domain/company-domain.service';

@Module({
  providers: [
    PrismaService,
    EmailTemplateService,
    {
      provide: 'CompanyRepository',
      useClass: PrismaCompanyRepository,
    },
    {
      provide: 'EmailRecipientRepository',
      useClass: PrismaEmailRecipientRepository,
    },
    {
      provide: 'EmailService',
      useClass: NodemailerEmailService,
    },
    {
      provide: 'ValidationService',
      useClass: BusinessValidationService,
    },
    {
      provide: 'NotificationService',
      useClass: EmailNotificationService,
    },
        {
          provide: 'CompanyDomainService',
          useClass: CompanyDomainServiceImpl,
        },
  ],
  exports: [
    'CompanyRepository',
    'EmailRecipientRepository',
    'EmailService',
    'ValidationService',
    'NotificationService',
    'CompanyDomainService',
  ],
})
export class InfrastructureModule {}
