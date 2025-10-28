import { Company } from "../../domain/entities/company.entity";

export class CreateCompanyDto {
  name: string;
  cnpj: string;
  tradeName: string;
  address: string;
  favorite?: boolean;
}

export class UpdateCompanyDto {
  name?: string;
  cnpj?: string;
  tradeName?: string;
  address?: string;
  favorite?: boolean;
}

export class CompanyResponseDto {
  id: number;
  name: string;
  cnpj: string;
  tradeName: string;
  address: string;
  favorite: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(company: Company): CompanyResponseDto {
    return {
      id: company.id,
      name: company.name,
      cnpj: company.cnpj,
      tradeName: company.tradeName,
      address: company.address,
      favorite: company.favorite,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }
}
