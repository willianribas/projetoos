
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

export const usePermanentDeleteServiceOrder = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("service_orders")
        .delete()
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deleted_service_orders", user?.id] });
      toast({
        title: "Ordem de Serviço excluída permanentemente",
        description: "A OS foi excluída permanentemente do sistema.",
        variant: "destructive",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error permanently deleting service order:", error);
      toast({
        title: "Erro ao excluir permanentemente",
        description: "Ocorreu um erro ao tentar excluir permanentemente a ordem de serviço.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });
};
