import { Test, TestingModule } from "@nestjs/testing";
import { DeleteEmailRecipientUseCase } from "../../../../src/application/use-cases/email-recipient/delete-email-recipient.use-case";
import { NotFoundException } from "@nestjs/common";
import { EmailRecipientRepository } from "../../../../src/domain/repositories/email-recipient.repository";
import { EmailRecipient } from "../../../../src/domain/entities/email-recipient.entity";

describe("DeleteEmailRecipientUseCase", () => {
  let useCase: DeleteEmailRecipientUseCase;
  let repository: EmailRecipientRepository;

  const mockRecipient: EmailRecipient = EmailRecipient.create(
    "test@example.com",
    true
  );

  beforeEach(async () => {
    const mockRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteEmailRecipientUseCase,
        { provide: "EmailRecipientRepository", useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<DeleteEmailRecipientUseCase>(
      DeleteEmailRecipientUseCase
    );
    repository = module.get<EmailRecipientRepository>(
      "EmailRecipientRepository"
    );
  });

  it("deve ser definido", () => {
    expect(useCase).toBeDefined();
  });

  it("deve deletar um destinatário existente", async () => {
    jest.spyOn(repository, "findById").mockResolvedValue(mockRecipient);
    jest.spyOn(repository, "delete").mockResolvedValue(undefined);

    await useCase.execute(1);

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it("deve lançar exceção quando destinatário não existe", async () => {
    jest.spyOn(repository, "findById").mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
    expect(repository.findById).toHaveBeenCalledWith(999);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
