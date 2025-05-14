
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/hooks/use-toast";
import { ServiceOrder } from "@/types";

interface SharedServiceOrder {
  id: string;
  service_order_id: number;
  shared_by: string;
  shared_with: string;
  message?: string | null;
  shared_at: string;
  is_accepted: boolean | null;
}

interface SharedOrderWithDetails extends SharedServiceOrder {
  service_orders: ServiceOrder;
  profiles: {
    full_name: string;
    email?: string;
  };
}

export const useSharedServiceOrders = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query for received service orders that haven't been accepted yet
  const { data: receivedOrders = [], isLoading: isLoadingReceived } = useQuery({
    queryKey: ["received_service_orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shared_service_orders")
        .select(`
          *,
          service_orders (*),
          profiles:shared_by (full_name, email)
        `)
        .eq("shared_with", user?.id)
        .is("is_accepted", null);

      if (error) throw error;
      return data as SharedOrderWithDetails[];
    },
    enabled: !!user,
  });

  // Query for sent service orders
  const { data: sentOrders = [], isLoading: isLoadingSent } = useQuery({
    queryKey: ["sent_service_orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shared_service_orders")
        .select(`
          *,
          service_orders (*),
          profiles:shared_with (full_name, email)
        `)
        .eq("shared_by", user?.id);

      if (error) throw error;
      return data as SharedOrderWithDetails[];
    },
    enabled: !!user,
  });

  // Accept shared service order
  const acceptMutation = useMutation({
    mutationFn: async (sharedOrderId: string) => {
      // Find the shared order
      const sharedOrder = receivedOrders.find(order => order.id === sharedOrderId);
      
      if (!sharedOrder) throw new Error("Ordem compartilhada não encontrada");
      
      // 1. Mark as accepted in shared_service_orders
      const { error: updateError } = await supabase
        .from("shared_service_orders")
        .update({ is_accepted: true })
        .eq("id", sharedOrderId);
        
      if (updateError) throw updateError;
      
      // 2. Create a new service order for the recipient
      const { error: insertError } = await supabase
        .from("service_orders")
        .insert({
          ...sharedOrder.service_orders,
          id: undefined, // Let the database generate a new ID
          user_id: user?.id,
          created_at: new Date().toISOString(),
          deleted_at: null
        });
        
      if (insertError) throw insertError;
      
      // 3. Mark notification as read
      await supabase
        .from("notification_states")
        .update({ is_read: true })
        .eq("service_order_id", sharedOrder.service_order_id)
        .eq("user_id", user?.id);
        
      return sharedOrderId;
    },
    onSuccess: () => {
      toast({
        title: "Ordem de serviço aceita",
        description: "A ordem de serviço foi adicionada à sua lista.",
        variant: "success",
      });
      
      queryClient.invalidateQueries({ queryKey: ["received_service_orders", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["service_orders", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["notification_states", user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao aceitar ordem",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Reject shared service order
  const rejectMutation = useMutation({
    mutationFn: async (sharedOrderId: string) => {
      // Find the shared order
      const sharedOrder = receivedOrders.find(order => order.id === sharedOrderId);
      
      if (!sharedOrder) throw new Error("Ordem compartilhada não encontrada");
      
      // 1. Mark as rejected in shared_service_orders
      const { error: updateError } = await supabase
        .from("shared_service_orders")
        .update({ is_accepted: false })
        .eq("id", sharedOrderId);
        
      if (updateError) throw updateError;
      
      // 2. Restore the original service order for the sender (remove deleted_at)
      const { error: restoreError } = await supabase
        .from("service_orders")
        .update({ deleted_at: null })
        .eq("id", sharedOrder.service_order_id)
        .eq("user_id", sharedOrder.shared_by);
        
      if (restoreError) throw restoreError;
      
      // 3. Mark notification as read
      await supabase
        .from("notification_states")
        .update({ is_read: true })
        .eq("service_order_id", sharedOrder.service_order_id)
        .eq("user_id", user?.id);
        
      return sharedOrderId;
    },
    onSuccess: () => {
      toast({
        title: "Ordem de serviço rejeitada",
        description: "A ordem de serviço foi devolvida ao remetente.",
        variant: "success",
      });
      
      queryClient.invalidateQueries({ queryKey: ["received_service_orders", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["notification_states", user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao rejeitar ordem",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const acceptSharedOrder = (sharedOrderId: string) => {
    acceptMutation.mutate(sharedOrderId);
  };
  
  const rejectSharedOrder = (sharedOrderId: string) => {
    rejectMutation.mutate(sharedOrderId);
  };

  return {
    receivedOrders,
    sentOrders,
    isLoading: isLoadingReceived || isLoadingSent,
    acceptSharedOrder,
    rejectSharedOrder,
  };
};
