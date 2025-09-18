
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, rpc } from "@/integrations/supabase/client";
import { ServiceOrder } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useServiceOrders } from "@/components/ServiceOrderProvider";
import { useAuth } from "@/components/AuthProvider";

export const useUpdateServiceOrder = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { serviceOrders } = useServiceOrders();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updatedOrder: ServiceOrder) => {
      const { id, ...dataToUpdate } = updatedOrder;
      
      // Check if status has been changed to ADE
      const currentOrder = serviceOrders.find(so => so.id === id);
      let updatePayload = { ...dataToUpdate };
      
      // Reset the created_at to now if status changed to ADE (to reset the timer)
      if (currentOrder && currentOrder.status !== "ADE" && dataToUpdate.status === "ADE") {
        updatePayload.created_at = new Date().toISOString();
      }
      
      const { data, error } = await supabase
        .from("service_orders")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      // Invalidate and refetch all related queries with immediate updates
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["service_orders"] }),
        queryClient.invalidateQueries({ queryKey: ["notification_states"] }),
        queryClient.invalidateQueries({ queryKey: ["deleted_service_orders"] }),
        queryClient.invalidateQueries({ queryKey: ["shared_service_orders"] })
      ]);
      
      // Force immediate refetch for real-time UI updates
      await queryClient.refetchQueries({ 
        queryKey: ["service_orders"], 
        type: 'active' 
      });
      
      // Create notification when status changes to ADE
      if (user && data.status === "ADE") {
        try {
          await rpc.createNotificationForRecipient(
            user.id,
            data.id,
            'service_order_status_changed'
          );
        } catch (error) {
          console.error("Error creating notification:", error);
        }
      }
      
      toast({
        title: "Ordem de Serviço atualizada",
        description: "As alterações foram salvas com sucesso!",
        variant: "default",
        className: "bg-blue-500 text-white border-none",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error updating service order:", error);
      toast({
        title: "Erro ao atualizar OS",
        description: "Ocorreu um erro ao tentar atualizar a ordem de serviço.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });
};
