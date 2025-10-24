export interface EmailService {
  sendCompanyNotificationEmail(company: {
    name: string;
    cnpj: string;
    tradeName: string;
    address: string;
  }, recipients: string[]): Promise<void>;
  
  sendEmailConfirmation(email: string): Promise<void>;
}
