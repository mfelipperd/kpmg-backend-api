import { Module } from "@nestjs/common";
import { HealthController } from "../../presentation/controllers/health.controller";
import { HealthService } from "../health.service";
import { PrismaModule } from "../database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
