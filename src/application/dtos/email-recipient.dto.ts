import { EmailRecipient } from "../../domain/entities/email-recipient.entity";

export class CreateEmailRecipientDto {
  email: string;
  active?: boolean;
}

export class UpdateEmailRecipientDto {
  email?: string;
  active?: boolean;
}

export class EmailRecipientResponseDto {
  id: number;
  email: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(emailRecipient: EmailRecipient): EmailRecipientResponseDto {
    return {
      id: emailRecipient.id,
      email: emailRecipient.email,
      active: emailRecipient.active,
      createdAt: emailRecipient.createdAt,
      updatedAt: emailRecipient.updatedAt,
    };
  }
}
