import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("Inicializando autenticação...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
          throw error;
        }

        if (mounted) {
          console.log("Sessão atual:", session);
          if (session?.user) {
            console.log("Usuário autenticado:", session.user);
            setUser(session.user);
            if (window.location.pathname === "/auth") {
              console.log("Redirecionando para página principal...");
              navigate("/");
            }
          } else {
            console.log("Nenhum usuário autenticado");
            setUser(null);
            if (window.location.pathname !== "/auth") {
              console.log("Redirecionando para login...");
              navigate("/auth");
            }
          }
        }
      } catch (error) {
        console.error("Erro ao inicializar auth:", error);
        if (mounted) {
          setUser(null);
          navigate("/auth");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Mudança no estado de autenticação:", event, session);
      
      if (mounted) {
        if (session?.user) {
          console.log("Novo usuário autenticado:", session.user);
          setUser(session.user);
          if (window.location.pathname === "/auth") {
            toast({
              title: "Login realizado com sucesso!",
              description: "Redirecionando para a página principal...",
              duration: 3000,
            });
            navigate("/");
          }
        } else {
          console.log("Usuário deslogado");
          setUser(null);
          navigate("/auth");
        }
      }
    });

    return () => {
      console.log("Limpando provider de autenticação");
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signOut = async () => {
    try {
      console.log("Iniciando logout...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("Logout realizado com sucesso");
      setUser(null);
      navigate("/auth");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      navigate("/auth");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};