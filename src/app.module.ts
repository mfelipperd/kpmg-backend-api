import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { PresentationModule } from "./presentation/presentation.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";

interface SmtpTransportConfig {
  host: string;
  port: number;
  secure: boolean;
  requireTLS?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
  tls: {
    rejectUnauthorized: boolean;
  };
  connectionTimeout?: number;
  greetingTimeout?: number;
  socketTimeout?: number;
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
        const emailHost = configService.get<string>(
          "EMAIL_HOST",
          "smtp.gmail.com"
        );
        const emailPort = configService.get<number>("EMAIL_PORT", 587);
        const emailSecure = configService.get<boolean>("EMAIL_SECURE", false);

        const transport: SmtpTransportConfig = {
          host: emailHost,
          port: emailPort,
          secure: emailSecure,
          requireTLS: !emailSecure,
          tls: {
            rejectUnauthorized: false,
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 10000,
        };

        if (emailUser && emailPass) {
          transport.auth = {
            user: emailUser.trim(),
            pass: emailPass.trim(),
          };
        }

        return {
          transport,
          defaults: {
            from: emailUser
              ? `"Company API" <${emailUser.trim()}>`
              : '"Company API" <noreply@companyapi.com>',
          },
        };
      },
      inject: [ConfigService],
    }),
    InfrastructureModule,
    PresentationModule,
  ],
})
export class AppModule {}
