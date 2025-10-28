import { Company } from "../entities/company.entity";

export interface EmailService {
  sendCompanyNotificationEmail(
    company:
      | Company
      | {
          name: string;
          cnpj: string;
          tradeName: string;
          address: string;
        },
    recipients: string[]
  ): Promise<void>;

  sendEmailConfirmation(email: string): Promise<void>;
}
