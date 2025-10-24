import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Company } from '../../../domain/entities/company.entity';
import { CompanyRepository } from '../../../domain/repositories/company.repository';
import { EmailRecipientRepository } from '../../../domain/repositories/email-recipient.repository';
import { ValidationService } from '../../../domain/services/validation.service';
import { NotificationService } from '../../../domain/services/notification.service';
import { CompanyDomainService } from '../../../domain/services/company-domain.service';

export interface CreateCompanyRequest {
  name: string;
  cnpj: string;
  tradeName: string;
  address: string;
  favorite?: boolean;
}

export interface CreateCompanyResponse {
  company: Company;
  emailStatus: 'sent' | 'failed';
}

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepository,
    @Inject('EmailRecipientRepository')
    private readonly emailRecipientRepository: EmailRecipientRepository,
    @Inject('ValidationService')
    private readonly validationService: ValidationService,
    @Inject('NotificationService')
    private readonly notificationService: NotificationService,
    @Inject('CompanyDomainService')
    private readonly companyDomainService: CompanyDomainService,
  ) {}

  async execute(request: CreateCompanyRequest): Promise<CreateCompanyResponse> {
    await this.validationService.validateCompanyData(request);

    const companyExists = await this.companyDomainService.checkCompanyExistsByCnpj(request.cnpj);
    if (companyExists) {
      throw new ConflictException('Já existe uma empresa cadastrada com este CNPJ');
    }

    const savedCompany = await this.companyDomainService.createCompany(request);

    const activeRecipients = await this.emailRecipientRepository.findActiveRecipients();
    const notificationResult = await this.notificationService.notifyCompanyCreated(savedCompany, activeRecipients);

    return {
      company: savedCompany,
      emailStatus: notificationResult.success ? 'sent' : 'failed',
    };
  }
}
