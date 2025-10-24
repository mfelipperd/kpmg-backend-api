import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Company } from '../../../domain/entities/company.entity';
import { CompanyRepository } from '../../../domain/repositories/company.repository';

@Injectable()
export class GetCompanyByIdUseCase {
  constructor(
    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(id: number): Promise<Company> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }
    return company;
  }
}
