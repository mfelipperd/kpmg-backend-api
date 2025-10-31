import { Test, TestingModule } from "@nestjs/testing";
import { UpdateEmailRecipientUseCase } from "../../../../src/application/use-cases/email-recipient/update-email-recipient.use-case";
import { NotFoundException } from "@nestjs/common";
import { EmailRecipientRepository } from "../../../../src/domain/repositories/email-recipient.repository";
import { EmailRecipient } from "../../../../src/domain/entities/email-recipient.entity";

describe("UpdateEmailRecipientUseCase", () => {
  let useCase: UpdateEmailRecipientUseCase;
  let repository: EmailRecipientRepository;

  const mockRecipient: EmailRecipient = EmailRecipient.create(
    "test@example.com",
    true
  );

  beforeEach(async () => {
    const mockRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateEmailRecipientUseCase,
        { provide: "EmailRecipientRepository", useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<UpdateEmailRecipientUseCase>(
      UpdateEmailRecipientUseCase
    );
    repository = module.get<EmailRecipientRepository>(
      "EmailRecipientRepository"
    );
  });

  it("deve ser definido", () => {
    expect(useCase).toBeDefined();
  });

  it("deve atualizar um destinatário com sucesso", async () => {
    const updateRequest = {
      id: 1,
      active: false,
    };

    const updatedRecipient = EmailRecipient.create("test@example.com", false);

    jest.spyOn(repository, "findById").mockResolvedValue(mockRecipient);
    jest.spyOn(repository, "update").mockResolvedValue(updatedRecipient);

    const result = await useCase.execute(updateRequest);

    expect(result).toEqual(updatedRecipient);
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.update).toHaveBeenCalled();
  });

  it("deve lançar exceção quando destinatário não existe", async () => {
    const updateRequest = {
      id: 999,
      active: false,
    };

    jest.spyOn(repository, "findById").mockResolvedValue(null);

    await expect(useCase.execute(updateRequest)).rejects.toThrow(
      NotFoundException
    );
    expect(repository.findById).toHaveBeenCalledWith(999);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("deve atualizar o e-mail se fornecido", async () => {
    const updateRequest = {
      id: 1,
      email: "updated@example.com",
    };

    const updatedRecipient = EmailRecipient.create("updated@example.com", true);

    jest.spyOn(repository, "findById").mockResolvedValue(mockRecipient);
    jest.spyOn(repository, "update").mockResolvedValue(updatedRecipient);

    const result = await useCase.execute(updateRequest);

    expect(result).toEqual(updatedRecipient);
  });
});
