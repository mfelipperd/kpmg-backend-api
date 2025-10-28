import { Injectable, Inject, ConflictException, Logger } from "@nestjs/common";
import { Company } from "../../../domain/entities/company.entity";
import { CompanyRepository } from "../../../domain/repositories/company.repository";
import { EmailRecipientRepository } from "../../../domain/repositories/email-recipient.repository";
import { ValidationService } from "../../../domain/services/validation.service";
import { NotificationService } from "../../../domain/services/notification.service";
import { CompanyDomainService } from "../../../domain/services/company-domain.service";

export interface CreateCompanyRequest {
  name: string;
  cnpj: string;
  tradeName: string;
  address: string;
  favorite?: boolean;
}

export interface CreateCompanyResponse {
  company: Company;
  emailStatus: "sent" | "failed";
}

@Injectable()
export class CreateCompanyUseCase {
  private readonly logger = new Logger(CreateCompanyUseCase.name);

  constructor(
    @Inject("CompanyRepository")
    private readonly companyRepository: CompanyRepository,
    @Inject("EmailRecipientRepository")
    private readonly emailRecipientRepository: EmailRecipientRepository,
    @Inject("ValidationService")
    private readonly validationService: ValidationService,
    @Inject("NotificationService")
    private readonly notificationService: NotificationService,
    @Inject("CompanyDomainService")
    private readonly companyDomainService: CompanyDomainService,
  ) {}

  async execute(request: CreateCompanyRequest): Promise<CreateCompanyResponse> {
    this.logger.log(
      `Iniciando criação de empresa: ${request.name} (CNPJ: ${request.cnpj})`,
    );

    await this.validationService.validateCompanyData(request);

    const companyExists =
      await this.companyDomainService.checkCompanyExistsByCnpj(request.cnpj);
    if (companyExists) {
      this.logger.warn(
        `Tentativa de cadastrar empresa com CNPJ já existente: ${request.cnpj}`,
      );
      throw new ConflictException(
        "Já existe uma empresa cadastrada com este CNPJ",
      );
    }

    const savedCompany = await this.companyDomainService.createCompany(request);
    this.logger.log(
      `Empresa criada com sucesso: ID ${savedCompany.id} - ${savedCompany.name}`,
    );

    const activeRecipients =
      await this.emailRecipientRepository.findActiveRecipients();
    const notificationResult =
      await this.notificationService.notifyCompanyCreated(
        savedCompany,
        activeRecipients,
      );

    if (!notificationResult.success) {
      this.logger.error(
        `Falha ao enviar notificações por e-mail para empresa ${savedCompany.id}: ${notificationResult.error}`,
      );
    } else {
      this.logger.log(
        `Notificações enviadas para ${activeRecipients.length} destinatário(s)`,
      );
    }

    return {
      company: savedCompany,
      emailStatus: notificationResult.success ? "sent" : "failed",
    };
  }
}
