import { Test, TestingModule } from "@nestjs/testing";
import { GetCompanyByIdUseCase } from "../../../../src/application/use-cases/company/get-company-by-id.use-case";
import { NotFoundException } from "@nestjs/common";
import { CompanyRepository } from "../../../../src/domain/repositories/company.repository";
import { Company } from "../../../../src/domain/entities/company.entity";

describe("GetCompanyByIdUseCase", () => {
  let useCase: GetCompanyByIdUseCase;
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
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCompanyByIdUseCase,
        { provide: "CompanyRepository", useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<GetCompanyByIdUseCase>(GetCompanyByIdUseCase);
    repository = module.get<CompanyRepository>("CompanyRepository");
  });

  it("deve ser definido", () => {
    expect(useCase).toBeDefined();
  });

  it("deve retornar uma empresa quando existe", async () => {
    jest.spyOn(repository, "findById").mockResolvedValue(mockCompany);

    const result = await useCase.execute(1);

    expect(result).toEqual(mockCompany);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it("deve lançar exceção quando empresa não existe", async () => {
    jest.spyOn(repository, "findById").mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
    expect(repository.findById).toHaveBeenCalledWith(999);
  });
});
