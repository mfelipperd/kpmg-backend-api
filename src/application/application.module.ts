import { Module } from '@nestjs/common';
import { CreateCompanyUseCase } from './use-cases/company/create-company.use-case';
import { GetCompaniesUseCase } from './use-cases/company/get-companies.use-case';
import { GetCompanyByIdUseCase } from './use-cases/company/get-company-by-id.use-case';
import { UpdateCompanyUseCase } from './use-cases/company/update-company.use-case';
import { DeleteCompanyUseCase } from './use-cases/company/delete-company.use-case';
import { CreateEmailRecipientUseCase } from './use-cases/email-recipient/create-email-recipient.use-case';
import { GetEmailRecipientsUseCase } from './use-cases/email-recipient/get-email-recipients.use-case';
import { UpdateEmailRecipientUseCase } from './use-cases/email-recipient/update-email-recipient.use-case';
import { DeleteEmailRecipientUseCase } from './use-cases/email-recipient/delete-email-recipient.use-case';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [
    CreateCompanyUseCase,
    GetCompaniesUseCase,
    GetCompanyByIdUseCase,
    UpdateCompanyUseCase,
    DeleteCompanyUseCase,
    CreateEmailRecipientUseCase,
    GetEmailRecipientsUseCase,
    UpdateEmailRecipientUseCase,
    DeleteEmailRecipientUseCase,
  ],
  exports: [
    CreateCompanyUseCase,
    GetCompaniesUseCase,
    GetCompanyByIdUseCase,
    UpdateCompanyUseCase,
    DeleteCompanyUseCase,
    CreateEmailRecipientUseCase,
    GetEmailRecipientsUseCase,
    UpdateEmailRecipientUseCase,
    DeleteEmailRecipientUseCase,
  ],
})
export class ApplicationModule {}
