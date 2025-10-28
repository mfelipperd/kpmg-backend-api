import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from "@nestjs/common";
import { Company } from "../../../domain/entities/company.entity";
import { CompanyRepository } from "../../../domain/repositories/company.repository";

export interface UpdateCompanyRequest {
  id: number;
  name?: string;
  cnpj?: string;
  tradeName?: string;
  address?: string;
  favorite?: boolean;
}

@Injectable()
export class UpdateCompanyUseCase {
  constructor(
    @Inject("CompanyRepository")
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(request: UpdateCompanyRequest): Promise<Company> {
    const existingCompany = await this.companyRepository.findById(request.id);
    if (!existingCompany) {
      throw new NotFoundException("Empresa não encontrada");
    }

    if (request.cnpj && request.cnpj !== existingCompany.cnpj) {
      const companyWithSameCnpj = await this.companyRepository.findByCnpj(
        request.cnpj,
      );
      if (companyWithSameCnpj && companyWithSameCnpj.id !== request.id) {
        throw new ConflictException("CNPJ já cadastrado para outra empresa");
      }
    }

    const updatedCompany = existingCompany.update({
      name: request.name,
      cnpj: request.cnpj,
      tradeName: request.tradeName,
      address: request.address,
      favorite: request.favorite,
    });

    return this.companyRepository.update(request.id, updatedCompany);
  }
}
