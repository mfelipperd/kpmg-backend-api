import { Test, TestingModule } from "@nestjs/testing";
import { UpdateCompanyUseCase } from "../../../../src/application/use-cases/company/update-company.use-case";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { CompanyRepository } from "../../../../src/domain/repositories/company.repository";
import { Company } from "../../../../src/domain/entities/company.entity";

describe("UpdateCompanyUseCase", () => {
  let useCase: UpdateCompanyUseCase;
  let repository: CompanyRepository;

  const mockCompany: Company = Company.create(
    "Empresa Teste",
    "12345678000190",
    "Empresa Teste LTDA",
    "Rua Teste, 123",
    false
  );

  beforeEach(async () => {
    const mockRepository = {
      findById: jest.fn(),
      findByCnpj: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCompanyUseCase,
        { provide: "CompanyRepository", useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<UpdateCompanyUseCase>(UpdateCompanyUseCase);
    repository = module.get<CompanyRepository>("CompanyRepository");
  });

  it("deve ser definido", () => {
    expect(useCase).toBeDefined();
  });

  it("deve atualizar uma empresa com sucesso", async () => {
    const updateRequest = {
      id: 1,
      name: "Empresa Atualizada",
    };

    const updatedCompany = Company.create(
      "Empresa Atualizada",
      "12345678000190",
      "Empresa Teste LTDA",
      "Rua Teste, 123",
      false
    );

    jest.spyOn(repository, "findById").mockResolvedValue(mockCompany);
    jest.spyOn(repository, "update").mockResolvedValue(updatedCompany);

    const result = await useCase.execute(updateRequest);

    expect(result).toEqual(updatedCompany);
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.update).toHaveBeenCalled();
  });

  it("deve lançar exceção quando empresa não existe", async () => {
    const updateRequest = {
      id: 999,
      name: "Empresa Atualizada",
    };

    jest.spyOn(repository, "findById").mockResolvedValue(null);

    await expect(useCase.execute(updateRequest)).rejects.toThrow(
      NotFoundException
    );
    expect(repository.findById).toHaveBeenCalledWith(999);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("deve lançar exceção quando CNPJ já está em uso", async () => {
    const updateRequest = {
      id: 1,
      cnpj: "98765432000110",
    };

    const companyWithSameCnpj = Company.create(
      "Outra Empresa",
      "98765432000110",
      "Outra Empresa LTDA",
      "Rua Outra, 456",
      false
    );

    jest.spyOn(repository, "findById").mockResolvedValue(mockCompany);
    jest.spyOn(repository, "findByCnpj").mockResolvedValue(companyWithSameCnpj);

    await expect(useCase.execute(updateRequest)).rejects.toThrow(
      ConflictException
    );
    expect(repository.findByCnpj).toHaveBeenCalledWith("98765432000110");
  });
});
