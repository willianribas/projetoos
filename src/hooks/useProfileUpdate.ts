import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/components/profile/ProfileFetcher";
import { debounce } from "lodash";

export const useProfileUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { fetchProfile } = useProfile();

  const updateProfile = async (userId: string, updates: { full_name: string }) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Perfil atualizado com sucesso",
        description: "Suas informações foram salvas.",
        variant: "default",
        className: "bg-green-500 text-white border-none",
      });

      // Aguarda um pouco antes de buscar o perfil novamente
      setTimeout(() => {
        fetchProfile();
      }, 1000);
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: error.message || "Não foi possível salvar suas informações.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Debounce da função de atualização para evitar múltiplas requisições
  const debouncedUpdate = debounce(updateProfile, 500);

  return {
    isUpdating,
    updateProfile: debouncedUpdate,
  };
};