import { Module } from "@nestjs/common";
import { PrismaModule } from "./database/prisma.module";
import { PrismaCompanyRepository } from "./database/repositories/prisma-company.repository";
import { PrismaEmailRecipientRepository } from "./database/repositories/prisma-email-recipient.repository";
import { NodemailerEmailService } from "./email/nodemailer-email.service";
import { EmailTemplateService } from "./email/email-template.service";

import { CompanyDomainServiceImpl } from "../domain/services/company-domain.service";

@Module({
  imports: [PrismaModule],
  providers: [
    EmailTemplateService,
    {
      provide: "CompanyRepository",
      useClass: PrismaCompanyRepository,
    },
    {
      provide: "EmailRecipientRepository",
      useClass: PrismaEmailRecipientRepository,
    },
    {
      provide: "EmailService",
      useClass: NodemailerEmailService,
    },
    {
      provide: "CompanyDomainService",
      useClass: CompanyDomainServiceImpl,
    },
  ],
  exports: [
    "CompanyRepository",
    "EmailRecipientRepository",
    "EmailService",
    "CompanyDomainService",
  ],
})
export class InfrastructureModule {}
