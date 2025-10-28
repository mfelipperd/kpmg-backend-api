import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, BadRequestException } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AllExceptionsFilter } from "./infrastructure/filters/http-exception.filter";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug", "verbose"],
  });

  // Exception Filter Global
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors
          .map((error) => Object.values(error.constraints || {}))
          .flat();
        return new BadRequestException(messages.join(", "));
      },
    }),
  );

  app.enableCors({
    cors: "*",
  });

  const config = new DocumentBuilder()
    .setTitle("Company Management API")
    .setDescription(
      "API para gerenciamento de empresas e destinatários de e-mail",
    )
    .setVersion("1.0")
    .addTag("companies", "Operações relacionadas a empresas")
    .addTag("emails", "Operações relacionadas a destinatários de e-mail")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`API Documentation: http://localhost:${port}/api`);
}
void bootstrap();
