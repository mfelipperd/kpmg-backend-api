import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { PresentationModule } from "./presentation/presentation.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { HealthModule } from "./infrastructure/health/health.module";

interface SmtpTransportConfig {
  host: string;
  port: number;
  secure: boolean;
  auth?: {
    user: string;
    pass: string;
  };
  tls: {
    rejectUnauthorized: boolean;
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const emailUser = configService.get<string>("EMAIL_USER");
        const emailPass = configService.get<string>("EMAIL_PASS");

        const transport: SmtpTransportConfig = {
          host: configService.get<string>("EMAIL_HOST", "smtp.gmail.com"),
          port: configService.get<number>("EMAIL_PORT", 587),
          secure: configService.get<boolean>("EMAIL_SECURE", false),
          tls: {
            rejectUnauthorized: false,
          },
        };

        if (emailUser && emailPass) {
          transport.auth = {
            user: emailUser,
            pass: emailPass,
          };
        }

        return {
          transport,
          defaults: {
            from: emailUser
              ? `"Company API" <${emailUser}>`
              : '"Company API" <noreply@companyapi.com>',
          },
        };
      },
      inject: [ConfigService],
    }),
    InfrastructureModule,
    PresentationModule,
    HealthModule,
  ],
})
export class AppModule {}
