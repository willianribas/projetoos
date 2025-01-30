import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../AuthProvider";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string | null;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      if (!user?.id) {
        setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, created_at, updated_at")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([
            {
              id: user.id,
              full_name: user.email?.split('@')[0] || 'Usuário',
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile);
      } else {
        setProfile(data);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar suas informações.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  return { profile, isLoading, fetchProfile };
};