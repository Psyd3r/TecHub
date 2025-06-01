
import { LoginCredentials, SignUpData } from "../models/AuthModel";

export class AuthController {
  static async login(credentials: LoginCredentials): Promise<boolean> {
    // Simulação de login - aqui seria integrado com backend/Supabase
    console.log("Tentativa de login:", credentials);
    
    // Validação simples
    if (!credentials.email || !credentials.password) {
      throw new Error("Email e senha são obrigatórios");
    }

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Para demo, aceitar qualquer email/senha válidos
    if (credentials.email.includes("@") && credentials.password.length >= 6) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", credentials.email);
      return true;
    }
    
    throw new Error("Email ou senha inválidos");
  }

  static async signUp(data: SignUpData): Promise<boolean> {
    console.log("Dados de cadastro:", data);
    
    // Validações
    if (data.personal.password !== data.personal.confirmPassword) {
      throw new Error("Senhas não conferem");
    }

    if (!data.personal.email.includes("@")) {
      throw new Error("Email inválido");
    }

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular criação de conta
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", data.personal.email);
    return true;
  }

  static logout(): void {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
  }

  static isAuthenticated(): boolean {
    return localStorage.getItem("isLoggedIn") === "true";
  }

  static getCurrentUser(): string | null {
    return localStorage.getItem("userEmail");
  }
}
