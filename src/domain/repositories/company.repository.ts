import { Company } from "../entities/company.entity";

export interface CompanyRepository {
  create(company: Company): Promise<Company>;
  findAll(): Promise<Company[]>;
  findById(id: number): Promise<Company | null>;
  findByCnpj(cnpj: string): Promise<Company | null>;
  update(id: number, company: Company): Promise<Company>;
  delete(id: number): Promise<void>;
}
