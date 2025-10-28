import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class HealthService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHealthStatus() {
    const startTime = Date.now();

    try {
      await this.prismaService.$queryRaw`SELECT 1`;

      const dbResponseTime = Date.now() - startTime;

      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        version: process.env.npm_package_version || "1.0.0",
        checks: {
          database: {
            status: "ok",
            responseTime: `${dbResponseTime}ms`,
          },
          memory: {
            status: "ok",
            used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
            total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
          },
          disk: {
            status: "ok",
            free: "available",
          },
        },
        info: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
          pid: process.pid,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        status: "error",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        version: process.env.npm_package_version || "1.0.0",
        checks: {
          database: {
            status: "error",
            error: errorMessage,
          },
          memory: {
            status: "ok",
            used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
            total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
          },
          disk: {
            status: "ok",
            free: "available",
          },
        },
        info: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
          pid: process.pid,
        },
      };
    }
  }

  async getHealthStatusSimple() {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;

      return {
        status: "ok",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        status: "error",
        timestamp: new Date().toISOString(),
        error: errorMessage,
      };
    }
  }
}
