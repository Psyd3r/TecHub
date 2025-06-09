
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/AuthStore';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'customer';

export const useUserRole = () => {
  const { user } = useAuthStore();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar role do usuário:', error);
          setRole('customer'); // Default para customer em caso de erro
        } else {
          setRole(data.role as UserRole);
        }
      } catch (error) {
        console.error('Erro ao buscar role do usuário:', error);
        setRole('customer');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isAdmin = role === 'admin';
  const isCustomer = role === 'customer';

  return {
    role,
    isAdmin,
    isCustomer,
    loading
  };
};
