import { Injectable, Inject } from "@nestjs/common";
import { Company } from "../../../domain/entities/company.entity";
import { CompanyRepository } from "../../../domain/repositories/company.repository";

@Injectable()
export class GetCompaniesUseCase {
  constructor(
    @Inject("CompanyRepository")
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(): Promise<Company[]> {
    return this.companyRepository.findAll();
  }
}
