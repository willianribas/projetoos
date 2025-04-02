
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDeleteAnalyzer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("analyzers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyzers"] });
      toast({
        title: "Analisador removido",
        description: "O analisador foi removido com sucesso",
      });
    },
    onError: (error: any) => {
      console.error("Error deleting analyzer:", error);
      toast({
        variant: "destructive",
        title: "Erro ao remover analisador",
        description: error.message || "Não foi possível remover o analisador",
      });
    },
  });
};
