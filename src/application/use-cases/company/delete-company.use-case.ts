import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { CompanyRepository } from "../../../domain/repositories/company.repository";

@Injectable()
export class DeleteCompanyUseCase {
  constructor(
    @Inject("CompanyRepository")
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new NotFoundException("Empresa não encontrada");
    }

    await this.companyRepository.delete(id);
  }
}
