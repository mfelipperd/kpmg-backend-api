import { Test, TestingModule } from "@nestjs/testing";
import { DeleteCompanyUseCase } from "../../../../src/application/use-cases/company/delete-company.use-case";
import { NotFoundException } from "@nestjs/common";
import { CompanyRepository } from "../../../../src/domain/repositories/company.repository";
import { Company } from "../../../../src/domain/entities/company.entity";

describe("DeleteCompanyUseCase", () => {
  let useCase: DeleteCompanyUseCase;
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
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCompanyUseCase,
        { provide: "CompanyRepository", useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<DeleteCompanyUseCase>(DeleteCompanyUseCase);
    repository = module.get<CompanyRepository>("CompanyRepository");
  });

  it("deve ser definido", () => {
    expect(useCase).toBeDefined();
  });

  it("deve deletar uma empresa existente", async () => {
    jest.spyOn(repository, "findById").mockResolvedValue(mockCompany);
    jest.spyOn(repository, "delete").mockResolvedValue(undefined);

    await useCase.execute(1);

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it("deve lançar exceção quando empresa não existe", async () => {
    jest.spyOn(repository, "findById").mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
    expect(repository.findById).toHaveBeenCalledWith(999);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
