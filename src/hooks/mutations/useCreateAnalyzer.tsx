
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Analyzer } from "@/types/analyzer";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export const useCreateAnalyzer = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (analyzerData: Omit<Analyzer, 'user_id' | 'created_at' | 'status'>) => {
      const { data, error } = await supabase.from("analyzers").insert({
        ...analyzerData,
        user_id: user?.id,
        created_at: new Date().toISOString(),
      }).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyzers"] });
      toast({
        title: "Analisador adicionado",
        description: "O analisador foi adicionado com sucesso",
      });
    },
    onError: (error: any) => {
      console.error("Error creating analyzer:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar analisador",
        description: error.message || "Não foi possível adicionar o analisador",
      });
    },
  });
};
