
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogIn, LogOut, User, Settings, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/AuthStore";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AuthButton = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuthStore();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', user.id)
            .single();
          
          if (!error && data) {
            setUserProfile(data);
          }
        } catch (error) {
          console.error('Erro ao buscar perfil do usuário:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Até logo!"
      });
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Button variant="ghost" disabled className="text-white">
        <User className="h-4 w-4 mr-2" />
        Carregando...
      </Button>
    );
  }

  if (user) {
    const userName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : user.email?.split('@')[0];
    const userInitials = userProfile 
      ? `${userProfile.first_name?.[0] || ''}${userProfile.last_name?.[0] || ''}` 
      : user.email?.[0]?.toUpperCase() || 'U';

    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#4ADE80] text-black text-sm font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  Olá, {userName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#1B1B1B] border-white/10">
              <DropdownMenuItem 
                onClick={() => navigate("/orders")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                <Package className="h-4 w-4 mr-2" />
                Meus Pedidos
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    onClick={() => navigate("/admin")}
                    className="text-white hover:bg-white/10 cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Painel Administrativo
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Mobile version */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="text-white hover:bg-white/10"
            size="sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button 
      variant="ghost" 
      onClick={() => navigate("/auth")}
      className="text-white hover:bg-white/10"
    >
      <LogIn className="h-4 w-4 mr-2" />
      Entrar
    </Button>
  );
};
