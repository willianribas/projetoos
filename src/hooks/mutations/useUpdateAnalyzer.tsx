
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Analyzer } from "@/types/analyzer";
import { useToast } from "@/hooks/use-toast";

export const useUpdateAnalyzer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (analyzerData: Partial<Analyzer> & { id: string }) => {
      const { id, ...rest } = analyzerData;
      
      const { data, error } = await supabase
        .from("analyzers")
        .update(rest)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyzers"] });
      toast({
        title: "Analisador atualizado",
        description: "O analisador foi atualizado com sucesso",
      });
    },
    onError: (error: any) => {
      console.error("Error updating analyzer:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar analisador",
        description: error.message || "Não foi possível atualizar o analisador",
      });
    },
  });
};
