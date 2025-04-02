
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Analyzer } from "@/types/analyzer";
import { useToast } from "@/hooks/use-toast";

interface UpdateAnalyzerParams {
  id: string;
  data: Partial<Omit<Analyzer, "id" | "user_id" | "created_at" | "status">>;
}

export const useUpdateAnalyzer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateAnalyzerParams) => {
      // Format date if it's a Date object
      const formattedData = {
        ...data,
        calibration_due_date: data.calibration_due_date instanceof Date 
          ? data.calibration_due_date.toISOString() 
          : data.calibration_due_date
      };

      const { error } = await supabase
        .from("analyzers")
        .update(formattedData)
        .eq("id", id);

      if (error) throw error;
      return { id, ...data };
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
