import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  undoDeletedServiceOrder: (id: number) => void;
  lastDeletedServiceOrder: { id: number | null, timestamp: number | null };
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signOut: async () => {},
  refreshUser: async () => {},
  undoDeletedServiceOrder: () => {},
  lastDeletedServiceOrder: { id: null, timestamp: null }
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastDeletedServiceOrder, setLastDeletedServiceOrder] = useState<{ id: number | null, timestamp: number | null }>({ id: null, timestamp: null });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to undo a deleted service order
  const undoDeletedServiceOrder = (id: number) => {
    setLastDeletedServiceOrder({ id, timestamp: Date.now() });
  };

  const fetchCurrentUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Error refreshing session:", error);
        return false;
      }
      
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error in refreshSession:", error);
      return false;
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
      
      if (!currentUser) {
        const success = await refreshSession();
        if (!success) {
          navigate("/auth");
          toast({
            title: "Sessão expirada",
            description: "Sua sessão expirou. Por favor, faça login novamente.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      navigate("/auth");
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      // First check for existing session
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      // Then set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        } else if (event === 'SIGNED_OUT') {
          navigate("/auth");
        }
      });

      // Get rememberMe preference
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      
      // Set up session expiration check with different intervals based on rememberMe
      const checkSessionInterval = setInterval(async () => {
        // If we have a session, check if it's still valid
        if (session && new Date(session.expires_at * 1000) < new Date()) {
          // If "Remember Me" is enabled, try to refresh more aggressively
          const success = await refreshSession();
          if (!success) {
            // Only sign out automatically if "Remember Me" is not enabled
            if (!rememberMe) {
              await signOut();
            } else {
              // For "Remember Me" users, show a notification but keep trying to refresh
              toast({
                title: "Problemas de conexão",
                description: "Sua sessão está com problemas. Tente atualizar a página.",
                variant: "default",
              });
            }
          }
        }
      }, rememberMe ? 300000 : 60000); // Check every 5 minutes for remember me users, every 1 minute otherwise
      
      setLoading(false);

      return () => {
        subscription.unsubscribe();
        clearInterval(checkSessionInterval);
      };
    };

    setupAuth();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    localStorage.removeItem('rememberMe');
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      signOut, 
      refreshUser, 
      undoDeletedServiceOrder, 
      lastDeletedServiceOrder 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
