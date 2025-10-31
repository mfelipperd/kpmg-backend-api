import { Test, TestingModule } from "@nestjs/testing";
import { GetEmailRecipientsUseCase } from "../../../../src/application/use-cases/email-recipient/get-email-recipients.use-case";
import { EmailRecipientRepository } from "../../../../src/domain/repositories/email-recipient.repository";
import { EmailRecipient } from "../../../../src/domain/entities/email-recipient.entity";

describe("GetEmailRecipientsUseCase", () => {
  let useCase: GetEmailRecipientsUseCase;
  let repository: EmailRecipientRepository;

  const mockRecipients: EmailRecipient[] = [
    EmailRecipient.create("test1@example.com", true),
    EmailRecipient.create("test2@example.com", false),
  ];

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetEmailRecipientsUseCase,
        { provide: "EmailRecipientRepository", useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<GetEmailRecipientsUseCase>(GetEmailRecipientsUseCase);
    repository = module.get<EmailRecipientRepository>(
      "EmailRecipientRepository"
    );
  });

  it("deve ser definido", () => {
    expect(useCase).toBeDefined();
  });

  it("deve retornar lista de destinatários", async () => {
    jest.spyOn(repository, "findAll").mockResolvedValue(mockRecipients);

    const result = await useCase.execute();

    expect(result).toEqual(mockRecipients);
    expect(result).toHaveLength(2);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it("deve retornar lista vazia quando não há destinatários", async () => {
    jest.spyOn(repository, "findAll").mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
    expect(repository.findAll).toHaveBeenCalled();
  });
});
