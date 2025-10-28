import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { HealthService } from "../../infrastructure/health.service";
import { PrismaService } from "../../infrastructure/database/prisma.service";

@Module({
  controllers: [HealthController],
  providers: [HealthService, PrismaService],
  exports: [HealthService],
})
export class HealthModule {}
