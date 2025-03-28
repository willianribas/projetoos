
import React, { createContext, useContext } from "react";
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
}

const ServiceOrderContext = createContext<ServiceOrderContextType | undefined>(undefined);

export const ServiceOrderProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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
      const { error } = await supabase
        .from("service_orders")
        .update({
          numeroos: data.numeroos,
          patrimonio: data.patrimonio,
          equipamento: data.equipamento,
          status: data.status,
          priority: data.priority,
          observacao: data.observacao,
          // Exclude id, user_id, created_at and other fields that shouldn't be updated
        })
        .eq("id", data.id)
        .eq("user_id", user?.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_orders", user?.id] });
      toast({
        title: "Ordem de serviço atualizada",
        description: "A ordem de serviço foi atualizada com sucesso.",
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
      toast({
        title: "Ordem de serviço excluída",
        description: "A ordem de serviço foi movida para a lixeira. Você pode restaurá-la nas configurações.",
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

  return (
    <ServiceOrderContext.Provider
      value={{
        serviceOrders,
        isLoading,
        createServiceOrder,
        updateServiceOrder,
        deleteServiceOrder,
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
