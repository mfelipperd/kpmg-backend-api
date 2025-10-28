import { Controller, Get, HttpStatus, HttpCode } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { HealthService } from "../../infrastructure/health.service";

@ApiTags("Health")
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

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
        uptime: { type: "number", example: 3600 },
        environment: { type: "string", example: "development" },
        version: { type: "string", example: "1.0.0" },
        checks: {
          type: "object",
          properties: {
            database: {
              type: "object",
              properties: {
                status: { type: "string", example: "ok" },
                responseTime: { type: "string", example: "5ms" },
              },
            },
            memory: {
              type: "object",
              properties: {
                status: { type: "string", example: "ok" },
                used: { type: "string", example: "50MB" },
                total: { type: "string", example: "100MB" },
              },
            },
            disk: {
              type: "object",
              properties: {
                status: { type: "string", example: "ok" },
                free: { type: "string", example: "available" },
              },
            },
          },
        },
        info: {
          type: "object",
          properties: {
            nodeVersion: { type: "string", example: "v18.0.0" },
            platform: { type: "string", example: "darwin" },
            arch: { type: "string", example: "x64" },
            pid: { type: "number", example: 1234 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Erro na aplicação ou banco de dados",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "error" },
        timestamp: { type: "string", example: "2024-01-01T00:00:00.000Z" },
        checks: {
          type: "object",
          properties: {
            database: {
              type: "object",
              properties: {
                status: { type: "string", example: "error" },
                error: { type: "string", example: "Connection failed" },
              },
            },
          },
        },
      },
    },
  })
  async getHealth() {
    return this.healthService.getHealthStatus();
  }

  @Get("health/simple")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Simple Health Check",
    description:
      "Verificação simples de saúde da aplicação - ideal para load balancers",
  })
  @ApiResponse({
    status: 200,
    description: "Aplicação funcionando",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "ok" },
        timestamp: { type: "string", example: "2024-01-01T00:00:00.000Z" },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Erro na aplicação",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "error" },
        timestamp: { type: "string", example: "2024-01-01T00:00:00.000Z" },
        error: { type: "string", example: "Database connection failed" },
      },
    },
  })
  async getHealthSimple() {
    return this.healthService.getHealthStatusSimple();
  }

  @Get("ping")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Ping",
    description:
      "Endpoint simples para verificar se a aplicação está respondendo",
  })
  @ApiResponse({
    status: 200,
    description: "Pong response",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "pong" },
        timestamp: { type: "string", example: "2024-01-01T00:00:00.000Z" },
      },
    },
  })
  ping() {
    return {
      message: "pong",
      timestamp: new Date().toISOString(),
    };
  }
}
