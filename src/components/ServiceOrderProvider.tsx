
import React, { createContext, useContext, useState } from "react";
import { ServiceOrder } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { toast } from "@/hooks/use-toast";

interface ServiceOrderContextType {
  serviceOrders: ServiceOrder[];
  isLoading: boolean;
  createServiceOrder: (data: Omit<ServiceOrder, "id" | "created_at">) => void;
  updateServiceOrder: (data: ServiceOrder) => void;
  deleteServiceOrder: (id: number) => void;
  restoreServiceOrder: (id: number) => void;
  selectedOrders: number[];
  toggleOrderSelection: (id: number) => void;
  bulkUpdateServiceOrders: (updates: Partial<ServiceOrder>) => void;
  clearSelection: () => void;
}

const ServiceOrderContext = createContext<ServiceOrderContextType | undefined>(undefined);

export const ServiceOrderProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, undoDeletedServiceOrder } = useAuth();
  const queryClient = useQueryClient();
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  // Toggle order selection for batch operations
  const toggleOrderSelection = (id: number) => {
    setSelectedOrders(prevSelected => 
      prevSelected.includes(id) 
        ? prevSelected.filter(orderId => orderId !== id)
        : [...prevSelected, id]
    );
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedOrders([]);
  };

  // Fetch service orders with React Query - exclude deleted items
  const { data: serviceOrders = [], isLoading } = useQuery({
    queryKey: ["service_orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_orders")
        .select("*")
        .eq("user_id", user?.id)
        .is("deleted_at", null) // Only get non-deleted items
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar ordens de serviço",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as ServiceOrder[];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep unused data for 30 minutes
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Omit<ServiceOrder, "id" | "created_at">) => {
      const { data: newOrder, error } = await supabase
        .from("service_orders")
        .insert([{ ...data, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return newOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_orders", user?.id] });
      toast({
        title: "Ordem de serviço criada",
        description: "A ordem de serviço foi criada com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar ordem de serviço",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: ServiceOrder) => {
      // Check if status has been changed to ADE
      const currentOrder = serviceOrders.find(so => so.id === data.id);
      const updatedData = { ...data };
      
      // Reset the created_at to now if status changed to ADE (to reset the timer)
      if (currentOrder && currentOrder.status !== "ADE" && data.status === "ADE") {
        updatedData.created_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from("service_orders")
        .update({
          numeroos: updatedData.numeroos,
          patrimonio: updatedData.patrimonio,
          equipamento: updatedData.equipamento,
          status: updatedData.status,
          priority: updatedData.priority,
          observacao: updatedData.observacao,
          created_at: updatedData.created_at, // Include the possibly updated timestamp
        })
        .eq("id", updatedData.id)
        .eq("user_id", user?.id);

      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_orders", user?.id] });
      toast({
        title: "Ordem de serviço atualizada",
        description: "A ordem de serviço foi atualizada com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar ordem de serviço",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation - now soft delete
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log("Deleting service order with ID in provider:", id);
      const { error } = await supabase
        .from("service_orders")
        .update({ deleted_at: new Date().toISOString() }) // Soft delete
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error in delete mutation:", error);
        throw error;
      }
      return id;
    },
    onSuccess: (id) => {
      console.log("Successfully deleted service order with ID:", id);
      queryClient.invalidateQueries({ queryKey: ["service_orders", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["deleted_service_orders", user?.id] });
      
      // Track the deleted service order for potential undo
      undoDeletedServiceOrder(id);
      
      toast({
        title: "Ordem de serviço excluída",
        description: "A ordem de serviço foi movida para a lixeira. Pressione Ctrl+Z para desfazer.",
        className: "bg-red-500 text-white border-none",
      });
    },
    onError: (error) => {
      console.error("Error deleting service order:", error);
      toast({
        title: "Erro ao excluir ordem de serviço",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("service_orders")
        .update({ deleted_at: null })
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["service_orders", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["deleted_service_orders", user?.id] });
      toast({
        title: "Ordem de serviço restaurada",
        description: "A ordem de serviço foi restaurada com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao restaurar ordem de serviço",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ ids, updates }: { ids: number[], updates: Partial<ServiceOrder> }) => {
      // For each ID, update the order with the provided updates
      const promises = ids.map(id => 
        supabase
          .from("service_orders")
          .update(updates)
          .eq("id", id)
          .eq("user_id", user?.id)
      );
      
      await Promise.all(promises);
      return { ids, updates };
    },
    onSuccess: ({ ids }) => {
      queryClient.invalidateQueries({ queryKey: ["service_orders", user?.id] });
      toast({
        title: "Ordens atualizadas em lote",
        description: `${ids.length} ordens de serviço foram atualizadas com sucesso.`,
        variant: "default",
      });
      // Clear selection after batch update
      clearSelection();
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar ordens em lote",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createServiceOrder = (data: Omit<ServiceOrder, "id" | "created_at">) => {
    createMutation.mutate(data);
  };

  const updateServiceOrder = (data: ServiceOrder) => {
    updateMutation.mutate(data);
  };

  const deleteServiceOrder = (id: number) => {
    console.log("Deleting service order with ID from provider:", id);
    deleteMutation.mutate(id);
  };
  
  const restoreServiceOrder = (id: number) => {
    restoreMutation.mutate(id);
  };
  
  const bulkUpdateServiceOrders = (updates: Partial<ServiceOrder>) => {
    if (selectedOrders.length === 0) {
      toast({
        title: "Nenhuma ordem selecionada",
        description: "Selecione pelo menos uma ordem de serviço para atualizar em lote.",
        variant: "warning",
      });
      return;
    }
    
    bulkUpdateMutation.mutate({
      ids: selectedOrders,
      updates
    });
  };

  return (
    <ServiceOrderContext.Provider
      value={{
        serviceOrders,
        isLoading,
        createServiceOrder,
        updateServiceOrder,
        deleteServiceOrder,
        restoreServiceOrder,
        selectedOrders,
        toggleOrderSelection,
        bulkUpdateServiceOrders,
        clearSelection
      }}
    >
      {children}
    </ServiceOrderContext.Provider>
  );
};

export const useServiceOrders = () => {
  const context = useContext(ServiceOrderContext);
  if (context === undefined) {
    throw new Error("useServiceOrders must be used within a ServiceOrderProvider");
  }
  return context;
};
