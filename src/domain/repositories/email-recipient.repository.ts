import { EmailRecipient } from '../entities/email-recipient.entity';

export interface EmailRecipientRepository {
  create(emailRecipient: EmailRecipient): Promise<EmailRecipient>;
  findAll(): Promise<EmailRecipient[]>;
  findById(id: number): Promise<EmailRecipient | null>;
  findByEmail(email: string): Promise<EmailRecipient | null>;
  findActiveRecipients(): Promise<EmailRecipient[]>;
  update(id: number, emailRecipient: EmailRecipient): Promise<EmailRecipient>;
  delete(id: number): Promise<void>;
}
