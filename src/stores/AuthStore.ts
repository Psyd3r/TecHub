
import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { AuthService } from '@/services/AuthService';

interface AuthStoreState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  
  // Actions
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  initialize: () => void;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  
  signUp: async (email, password, metadata) => {
    console.log('Tentando cadastrar usuário:', { email, metadata });
    
    const { error } = await AuthService.signUp(email, password, metadata);
    
    console.log('Resultado do cadastro:', { error });
    
    return { error };
  },

  signIn: async (email, password) => {
    console.log('Tentando fazer login:', email);
    
    const { error } = await AuthService.signIn(email, password);
    
    console.log('Resultado do login:', { error });
    
    return { error };
  },

  signOut: async () => {
    console.log('Fazendo logout...');
    await AuthService.signOut();
  },

  resetPassword: async (email) => {
    const { error } = await AuthService.resetPassword(email);
    return { error };
  },

  initialize: () => {
    // Set up auth state listener
    const { data: { subscription } } = AuthService.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        set({ 
          session,
          user: session?.user ?? null,
          loading: false
        });
      }
    );

    // Get initial session
    AuthService.getCurrentSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      set({ 
        session,
        user: session?.user ?? null,
        loading: false
      });
    });

    // Store subscription for cleanup if needed
    return () => subscription.unsubscribe();
  }
}));
