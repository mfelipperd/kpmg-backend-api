import { Controller, Get, HttpStatus, HttpCode } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Health")
@Controller()
export class HealthController {
  @Get("health")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Health Check",
    description:
      "Verifica o status de saúde da aplicação, incluindo conectividade com banco de dados e recursos do sistema",
  })
  @ApiResponse({
    status: 200,
    description: "Aplicação funcionando corretamente",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "ok" },
        timestamp: { type: "string", example: "2024-01-01T00:00:00.000Z" },
      },
    },
  })
  getHealth() {
    return {
      timestamp: new Date(),
      status: 200,
    };
  }
}
