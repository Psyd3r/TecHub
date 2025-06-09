
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

export class AuthService {
  static async signUp(email: string, password: string, metadata?: any): Promise<{ data: any; error: any }> {
    const redirectUrl = `${window.location.origin}/`;
    
    console.log('Tentando cadastrar usuário:', { email, metadata });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });
    
    console.log('Resultado do cadastro:', { data, error });
    
    return { data, error };
  }

  static async signIn(email: string, password: string): Promise<{ data: any; error: any }> {
    console.log('Tentando fazer login:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    console.log('Resultado do login:', { data, error });
    
    return { data, error };
  }

  static async signOut(): Promise<void> {
    console.log('Fazendo logout...');
    await supabase.auth.signOut();
  }

  static async resetPassword(email: string): Promise<{ error: any }> {
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    
    return { error };
  }

  static async getCurrentSession(): Promise<{ data: { session: Session | null }; error: any }> {
    return await supabase.auth.getSession();
  }

  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
