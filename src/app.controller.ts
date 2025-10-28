import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AppService } from "./app.service";

@ApiTags("App")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: "Welcome",
    description: "Endpoint de boas-vindas da API",
  })
  @ApiResponse({
    status: 200,
    description: "Mensagem de boas-vindas",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Bem vindo a API de empresas!" },
        timestamp: { type: "string", example: "2024-01-01T00:00:00.000Z" },
        version: { type: "string", example: "1.0.0" },
        environment: { type: "string", example: "development" },
        docs: { type: "string", example: "/api" },
      },
    },
  })
  getHello() {
    return this.appService.getHello();
  }
}
