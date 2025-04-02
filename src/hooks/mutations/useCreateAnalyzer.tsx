
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Analyzer } from "@/types/analyzer";
import { useToast } from "@/hooks/use-toast";

export const useCreateAnalyzer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<Analyzer, "id" | "user_id" | "created_at" | "status">) => {
      const { error, data: newAnalyzer } = await supabase
        .from("analyzers")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return newAnalyzer;
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
