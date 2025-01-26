import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDeleteServiceOrder = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("service_orders")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_orders"] });
      toast({
        title: "Ordem de Serviço excluída",
        description: "A OS foi removida com sucesso!",
        variant: "default",
        className: "bg-red-500 text-white border-none",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error deleting service order:", error);
      toast({
        title: "Erro ao excluir OS",
        description: "Ocorreu um erro ao tentar excluir a ordem de serviço.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });
};