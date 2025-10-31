import { Test, TestingModule } from "@nestjs/testing";
import { CreateEmailRecipientUseCase } from "../../../../src/application/use-cases/email-recipient/create-email-recipient.use-case";
import { ConflictException } from "@nestjs/common";
import { EmailRecipientRepository } from "../../../../src/domain/repositories/email-recipient.repository";
import { EmailService } from "../../../../src/domain/services/email.service";
import { EmailRecipient } from "../../../../src/domain/entities/email-recipient.entity";

describe("CreateEmailRecipientUseCase", () => {
  let useCase: CreateEmailRecipientUseCase;
  let repository: EmailRecipientRepository;
  let emailService: EmailService;

  const mockRecipient: EmailRecipient = EmailRecipient.create(
    "test@example.com",
    true
  );

  beforeEach(async () => {
    const mockRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const mockEmailService = {
      sendEmailConfirmation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEmailRecipientUseCase,
        { provide: "EmailRecipientRepository", useValue: mockRepository },
        { provide: "EmailService", useValue: mockEmailService },
      ],
    }).compile();

    useCase = module.get<CreateEmailRecipientUseCase>(
      CreateEmailRecipientUseCase
    );
    repository = module.get<EmailRecipientRepository>(
      "EmailRecipientRepository"
    );
    emailService = module.get<EmailService>("EmailService");
  });

  it("deve ser definido", () => {
    expect(useCase).toBeDefined();
  });

  it("deve criar um destinatário com sucesso", async () => {
    const request = {
      email: "test@example.com",
      active: true,
    };

    jest.spyOn(repository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(repository, "create").mockResolvedValue(mockRecipient);
    jest
      .spyOn(emailService, "sendEmailConfirmation")
      .mockResolvedValue(undefined);

    const result = await useCase.execute(request);

    expect(result).toEqual(mockRecipient);
    expect(repository.findByEmail).toHaveBeenCalledWith("test@example.com");
    expect(repository.create).toHaveBeenCalled();
    expect(emailService.sendEmailConfirmation).toHaveBeenCalledWith(
      "test@example.com"
    );
  });

  it("deve lançar exceção quando e-mail já existe", async () => {
    const request = {
      email: "test@example.com",
      active: true,
    };

    jest.spyOn(repository, "findByEmail").mockResolvedValue(mockRecipient);

    await expect(useCase.execute(request)).rejects.toThrow(ConflictException);
    expect(repository.findByEmail).toHaveBeenCalledWith("test@example.com");
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("deve normalizar o e-mail para lowercase", async () => {
    const request = {
      email: "TEST@EXAMPLE.COM",
      active: true,
    };

    jest.spyOn(repository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(repository, "create").mockResolvedValue(mockRecipient);
    jest
      .spyOn(emailService, "sendEmailConfirmation")
      .mockResolvedValue(undefined);

    await useCase.execute(request);

    expect(repository.findByEmail).toHaveBeenCalledWith("test@example.com");
  });
});
