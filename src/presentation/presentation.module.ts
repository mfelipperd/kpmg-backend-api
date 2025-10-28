import { Module } from "@nestjs/common";
import { CompanyController } from "./controllers/company.controller";
import { EmailRecipientController } from "./controllers/email-recipient.controller";
import { ApplicationModule } from "../application/application.module";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

@Module({
  imports: [ApplicationModule, InfrastructureModule],
  controllers: [CompanyController, EmailRecipientController],
})
export class PresentationModule {}
