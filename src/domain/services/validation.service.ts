export interface ValidationService {
  validateCompanyData(data: {
    name: string;
    cnpj: string;
    tradeName: string;
    address: string;
  }): Promise<void>;

  validateEmailData(data: { email: string }): Promise<void>;
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}
