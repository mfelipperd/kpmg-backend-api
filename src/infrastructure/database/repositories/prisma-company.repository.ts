import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Company } from "../../../domain/entities/company.entity";
import { CompanyRepository } from "../../../domain/repositories/company.repository";

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(company: Company): Promise<Company> {
    const created = await this.prisma.company.create({
      data: {
        name: company.name,
        cnpj: company.cnpj,
        tradeName: company.tradeName,
        address: company.address,
        favorite: company.favorite,
      },
    });

    return new Company(
      created.id,
      created.name,
      created.cnpj,
      created.tradeName,
      created.address,
      created.favorite,
      created.createdAt,
      created.updatedAt
    );
  }

  async findAll(): Promise<Company[]> {
    const companies = await this.prisma.company.findMany({
      orderBy: { id: "asc" },
    });

    return companies.map(
      (company) =>
        new Company(
          company.id,
          company.name,
          company.cnpj,
          company.tradeName,
          company.address,
          company.favorite,
          company.createdAt,
          company.updatedAt
        )
    );
  }

  async findById(id: number): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return null;
    }

    return new Company(
      company.id,
      company.name,
      company.cnpj,
      company.tradeName,
      company.address,
      company.favorite,
      company.createdAt,
      company.updatedAt
    );
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { cnpj },
    });

    if (!company) {
      return null;
    }

    return new Company(
      company.id,
      company.name,
      company.cnpj,
      company.tradeName,
      company.address,
      company.favorite,
      company.createdAt,
      company.updatedAt
    );
  }

  async update(id: number, company: Company): Promise<Company> {
    const updated = await this.prisma.company.update({
      where: { id },
      data: {
        name: company.name,
        cnpj: company.cnpj,
        tradeName: company.tradeName,
        address: company.address,
        favorite: company.favorite,
      },
    });

    return new Company(
      updated.id,
      updated.name,
      updated.cnpj,
      updated.tradeName,
      updated.address,
      updated.favorite,
      updated.createdAt,
      updated.updatedAt
    );
  }

  async delete(id: number): Promise<void> {
    await this.prisma.company.delete({
      where: { id },
    });
  }
}
