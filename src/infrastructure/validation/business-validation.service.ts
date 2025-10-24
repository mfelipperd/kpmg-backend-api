import { Injectable } from '@nestjs/common';
import { ValidationService, ValidationError } from '../../domain/services/validation.service';

@Injectable()
export class BusinessValidationService implements ValidationService {
  async validateCompanyData(data: {
    name: string;
    cnpj: string;
    tradeName: string;
    address: string;
  }): Promise<void> {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Nome da empresa é obrigatório');
    }

    if (!data.cnpj || data.cnpj.trim().length === 0) {
      errors.push('CNPJ é obrigatório');
    } else if (!this.isValidCNPJ(data.cnpj)) {
      errors.push('CNPJ inválido');
    }

    if (!data.tradeName || data.tradeName.trim().length === 0) {
      errors.push('Nome fantasia é obrigatório');
    }

    if (!data.address || data.address.trim().length === 0) {
      errors.push('Endereço é obrigatório');
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '));
    }
  }

  async validateEmailData(data: {
    email: string;
  }): Promise<void> {
    const errors: string[] = [];

    if (!data.email || data.email.trim().length === 0) {
      errors.push('E-mail é obrigatório');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('E-mail inválido');
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '));
    }
  }

  private isValidCNPJ(cnpj: string): boolean {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    
    if (cleanCNPJ.length !== 14) {
      return false;
    }

    if (/^(\d)\1+$/.test(cleanCNPJ)) {
      return false;
    }

    let sum = 0;
    let weight = 5;

    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanCNPJ[i]) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }

    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(cleanCNPJ[12]) !== digit1) {
      return false;
    }

    sum = 0;
    weight = 6;

    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanCNPJ[i]) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }

    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;

    return parseInt(cleanCNPJ[13]) === digit2;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
