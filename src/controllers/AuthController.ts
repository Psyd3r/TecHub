
import { LoginCredentialsModel, RegisterUserModel, UserModel, UserModelValidator } from "@/models/UserModel";
import { LocalStorageService } from "@/services/LocalStorageService";
import { SignUpData } from "@/models/AuthModel";

export class AuthController {
  private static readonly AUTH_STORAGE_KEY = 'isLoggedIn';
  private static readonly USER_EMAIL_KEY = 'userEmail';
  
  static async login(credentials: LoginCredentialsModel): Promise<boolean> {
    // Validar credenciais
    const validationErrors = UserModelValidator.validateLoginCredentials(credentials);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }
    
    console.log("Tentativa de login:", credentials);
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Para demo, aceitar qualquer email/senha válidos
    if (credentials.email.includes("@") && credentials.password.length >= 6) {
      LocalStorageService.setItem(this.AUTH_STORAGE_KEY, "true");
      LocalStorageService.setItem(this.USER_EMAIL_KEY, credentials.email);
      return true;
    }
    
    throw new Error("Email ou senha inválidos");
  }

  static async register(userData: RegisterUserModel): Promise<boolean> {
    // Validar dados de registro
    const validationErrors = UserModelValidator.validateRegisterData(userData);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }
    
    console.log("Dados de cadastro:", userData);
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular criação de conta
    LocalStorageService.setItem(this.AUTH_STORAGE_KEY, "true");
    LocalStorageService.setItem(this.USER_EMAIL_KEY, userData.email);
    return true;
  }

  static async signUp(signUpData: SignUpData): Promise<boolean> {
    // Converter SignUpData para RegisterUserModel para usar a validação existente
    const registerData: RegisterUserModel = {
      firstName: signUpData.personal.firstName,
      lastName: signUpData.personal.lastName,
      email: signUpData.personal.email,
      phone: signUpData.personal.phone,
      cpf: signUpData.personal.cpf,
      birthDate: signUpData.personal.birthDate,
      password: signUpData.personal.password,
      confirmPassword: signUpData.personal.confirmPassword
    };

    // Usar o método register existente
    return await this.register(registerData);
  }

  static logout(): void {
    LocalStorageService.removeItem(this.AUTH_STORAGE_KEY);
    LocalStorageService.removeItem(this.USER_EMAIL_KEY);
  }

  static isAuthenticated(): boolean {
    return LocalStorageService.getItem<string>(this.AUTH_STORAGE_KEY) === "true";
  }

  static getCurrentUserEmail(): string | null {
    return LocalStorageService.getItem<string>(this.USER_EMAIL_KEY);
  }
  
  static getCurrentUser(): UserModel | null {
    const email = this.getCurrentUserEmail();
    if (!email) return null;
    
    // Em uma aplicação real, isso viria do backend
    return {
      id: "demo-user-id",
      firstName: "Usuário",
      lastName: "Demo",
      email: email,
      phone: "(11) 99999-9999",
      cpf: "000.000.000-00",
      birthDate: "1990-01-01"
    };
  }
}
