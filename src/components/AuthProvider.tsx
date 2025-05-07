
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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signOut: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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

      // Set up session expiration check
      const checkSessionInterval = setInterval(async () => {
        // If we have a session, check if it's still valid
        if (session && new Date(session.expires_at * 1000) < new Date()) {
          const success = await refreshSession();
          if (!success) {
            await signOut();
          }
        }
      }, 60000); // Check every minute
      
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
    <AuthContext.Provider value={{ user, session, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
