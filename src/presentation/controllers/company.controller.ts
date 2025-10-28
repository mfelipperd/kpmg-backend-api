import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateCompanyUseCase } from "../../application/use-cases/company/create-company.use-case";
import { GetCompaniesUseCase } from "../../application/use-cases/company/get-companies.use-case";
import { GetCompanyByIdUseCase } from "../../application/use-cases/company/get-company-by-id.use-case";
import { UpdateCompanyUseCase } from "../../application/use-cases/company/update-company.use-case";
import { DeleteCompanyUseCase } from "../../application/use-cases/company/delete-company.use-case";
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  CompanyResponseDto,
} from "../../application/dtos/company.dto";

@ApiTags("companies")
@Controller("companies")
export class CompanyController {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly getCompaniesUseCase: GetCompaniesUseCase,
    private readonly getCompanyByIdUseCase: GetCompanyByIdUseCase,
    private readonly updateCompanyUseCase: UpdateCompanyUseCase,
    private readonly deleteCompanyUseCase: DeleteCompanyUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Criar uma nova empresa" })
  @ApiResponse({ status: 201, description: "Empresa criada com sucesso" })
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    const result = await this.createCompanyUseCase.execute(createCompanyDto);
    return {
      company: CompanyResponseDto.fromEntity(result.company),
      emailStatus: result.emailStatus,
    };
  }

  @Get()
  @ApiOperation({ summary: "Listar todas as empresas" })
  @ApiResponse({
    status: 200,
    description: "Lista de empresas retornada com sucesso",
  })
  async findAll() {
    const companies = await this.getCompaniesUseCase.execute();
    return companies.map((company) => CompanyResponseDto.fromEntity(company));
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar empresa por ID" })
  @ApiResponse({ status: 200, description: "Empresa encontrada" })
  @ApiResponse({ status: 404, description: "Empresa não encontrada" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const company = await this.getCompanyByIdUseCase.execute(id);
    return CompanyResponseDto.fromEntity(company);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar empresa" })
  @ApiResponse({ status: 200, description: "Empresa atualizada com sucesso" })
  @ApiResponse({ status: 404, description: "Empresa não encontrada" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const company = await this.updateCompanyUseCase.execute({
      id,
      ...updateCompanyDto,
    });
    return CompanyResponseDto.fromEntity(company);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Deletar empresa" })
  @ApiResponse({ status: 200, description: "Empresa deletada com sucesso" })
  @ApiResponse({ status: 404, description: "Empresa não encontrada" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.deleteCompanyUseCase.execute(id);
    return { message: "Empresa deletada com sucesso" };
  }
}
