
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRestoreServiceOrder = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("service_orders")
        .update({ deleted_at: null })
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_orders"] });
      queryClient.invalidateQueries({ queryKey: ["deleted_service_orders"] });
      toast({
        title: "Ordem de Serviço restaurada",
        description: "A OS foi restaurada com sucesso!",
        variant: "default",
        className: "bg-green-500 text-white border-none",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error restoring service order:", error);
      toast({
        title: "Erro ao restaurar OS",
        description: "Ocorreu um erro ao tentar restaurar a ordem de serviço.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });
};
