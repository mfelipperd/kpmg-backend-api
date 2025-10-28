import { Injectable, Inject } from "@nestjs/common";
import { Company } from "../entities/company.entity";
import { CompanyRepository } from "../repositories/company.repository";

export interface CompanyDomainService {
  checkCompanyExistsByCnpj(cnpj: string): Promise<boolean>;
  createCompany(data: {
    name: string;
    cnpj: string;
    tradeName: string;
    address: string;
    favorite?: boolean;
  }): Promise<Company>;
}

@Injectable()
export class CompanyDomainServiceImpl implements CompanyDomainService {
  constructor(
    @Inject("CompanyRepository")
    private readonly companyRepository: CompanyRepository,
  ) {}

  async checkCompanyExistsByCnpj(cnpj: string): Promise<boolean> {
    const existingCompany = await this.companyRepository.findByCnpj(cnpj);
    return existingCompany !== null;
  }

  async createCompany(data: {
    name: string;
    cnpj: string;
    tradeName: string;
    address: string;
    favorite?: boolean;
  }): Promise<Company> {
    const company = Company.create(
      data.name,
      data.cnpj,
      data.tradeName,
      data.address,
      data.favorite || false,
    );

    return this.companyRepository.create(company);
  }
}
