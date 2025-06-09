
export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentialsModel {
  email: string;
  password: string;
}

export interface RegisterUserModel {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
}

export class UserModelValidator {
  static validateLoginCredentials(credentials: LoginCredentialsModel): string[] {
    const errors: string[] = [];
    
    if (!credentials.email || !this.isValidEmail(credentials.email)) {
      errors.push("Email inválido");
    }
    
    if (!credentials.password || credentials.password.length < 6) {
      errors.push("Senha deve ter pelo menos 6 caracteres");
    }
    
    return errors;
  }
  
  static validateRegisterData(data: RegisterUserModel): string[] {
    const errors: string[] = [];
    
    if (!data.firstName || data.firstName.trim().length < 2) {
      errors.push("Nome deve ter pelo menos 2 caracteres");
    }
    
    if (!data.lastName || data.lastName.trim().length < 2) {
      errors.push("Sobrenome deve ter pelo menos 2 caracteres");
    }
    
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push("Email inválido");
    }
    
    if (!data.phone || !this.isValidPhone(data.phone)) {
      errors.push("Telefone inválido");
    }
    
    if (!data.cpf || !this.isValidCPF(data.cpf)) {
      errors.push("CPF inválido");
    }
    
    if (!data.password || data.password.length < 6) {
      errors.push("Senha deve ter pelo menos 6 caracteres");
    }
    
    if (data.password !== data.confirmPassword) {
      errors.push("Senhas não conferem");
    }
    
    return errors;
  }
  
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
  }
  
  private static isValidCPF(cpf: string): boolean {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
  }
}
