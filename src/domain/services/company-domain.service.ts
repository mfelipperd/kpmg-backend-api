import { Company } from '../entities/company.entity';

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