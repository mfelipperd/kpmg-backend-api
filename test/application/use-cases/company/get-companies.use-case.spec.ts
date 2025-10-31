import { Test, TestingModule } from "@nestjs/testing";
import { GetCompaniesUseCase } from "../../../../src/application/use-cases/company/get-companies.use-case";
import { CompanyRepository } from "../../../../src/domain/repositories/company.repository";
import { Company } from "../../../../src/domain/entities/company.entity";

describe("GetCompaniesUseCase", () => {
  let useCase: GetCompaniesUseCase;
  let repository: CompanyRepository;

  const mockCompanies: Company[] = [
    Company.create(
      "Empresa Teste 1",
      "12345678000190",
      "Empresa Teste 1 LTDA",
      "Rua Teste, 123",
      false
    ),
    Company.create(
      "Empresa Teste 2",
      "98765432000110",
      "Empresa Teste 2 LTDA",
      "Avenida Teste, 456",
      true
    ),
  ];

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCompaniesUseCase,
        { provide: "CompanyRepository", useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<GetCompaniesUseCase>(GetCompaniesUseCase);
    repository = module.get<CompanyRepository>("CompanyRepository");
  });

  it("deve ser definido", () => {
    expect(useCase).toBeDefined();
  });

  it("deve retornar lista de empresas", async () => {
    jest.spyOn(repository, "findAll").mockResolvedValue(mockCompanies);

    const result = await useCase.execute();

    expect(result).toEqual(mockCompanies);
    expect(result).toHaveLength(2);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it("deve retornar lista vazia quando não há empresas", async () => {
    jest.spyOn(repository, "findAll").mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
    expect(repository.findAll).toHaveBeenCalled();
  });
});
