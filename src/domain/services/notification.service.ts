import { Company } from '../entities/company.entity';
import { EmailRecipient } from '../entities/email-recipient.entity';

export interface NotificationService {
  notifyCompanyCreated(company: Company, recipients: EmailRecipient[]): Promise<NotificationResult>;
  notifyEmailConfirmation(email: string): Promise<NotificationResult>;
}

export interface NotificationResult {
  success: boolean;
  message?: string;
  error?: string;
}
