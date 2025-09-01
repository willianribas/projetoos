import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

export const useClearAllServiceOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      // Delete all service orders for the current user (hard delete)
      const { error } = await supabase
        .from("service_orders")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["service_orders"] });
      queryClient.invalidateQueries({ queryKey: ["deleted_service_orders"] });
      queryClient.invalidateQueries({ queryKey: ["notification_states"] });
      
      toast({
        title: "🧹 OSP Limpas",
        description: "Todas as suas Ordens de Serviço foram excluídas permanentemente.",
        variant: "default",
        className: "bg-gradient-to-r from-red-50 to-orange-50 border-red-200 dark:from-red-950/20 dark:to-orange-950/20 dark:border-red-800",
        duration: 5000,
      });
    },
    onError: (error) => {
      console.error("Error clearing all service orders:", error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível excluir todas as OSP. Tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });
};