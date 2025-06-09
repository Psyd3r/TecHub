
import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { AuthService } from '@/services/AuthService';

interface AuthStoreState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  initialize: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  
  signUp: async (email, password, metadata) => {
    console.log('Tentando cadastrar usuário:', { email, metadata });
    
    try {
      const { error } = await AuthService.signUp(email, password, metadata);
      
      console.log('Resultado do cadastro:', { error });
      
      if (error) {
        set({ error: error.message });
      } else {
        set({ error: null });
      }
      
      return { error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no cadastro';
      set({ error: errorMessage });
      return { error: { message: errorMessage } };
    }
  },

  signIn: async (email, password) => {
    console.log('Tentando fazer login:', email);
    
    try {
      const { error } = await AuthService.signIn(email, password);
      
      console.log('Resultado do login:', { error });
      
      if (error) {
        set({ error: error.message });
      } else {
        set({ error: null });
      }
      
      return { error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no login';
      set({ error: errorMessage });
      return { error: { message: errorMessage } };
    }
  },

  signOut: async () => {
    console.log('Fazendo logout...');
    try {
      await AuthService.signOut();
      set({ error: null });
    } catch (error) {
      console.error('Erro no logout:', error);
      set({ error: error instanceof Error ? error.message : 'Erro no logout' });
    }
  },

  resetPassword: async (email) => {
    try {
      const { error } = await AuthService.resetPassword(email);
      
      if (error) {
        set({ error: error.message });
      } else {
        set({ error: null });
      }
      
      return { error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na recuperação';
      set({ error: errorMessage });
      return { error: { message: errorMessage } };
    }
  },

  initialize: () => {
    // Set up auth state listener
    const { data: { subscription } } = AuthService.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        set({ 
          session,
          user: session?.user ?? null,
          loading: false,
          error: null
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
  },

  clearError: () => set({ error: null })
}));
