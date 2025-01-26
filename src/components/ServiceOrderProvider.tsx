import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceOrder } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ServiceOrderContextType {
  serviceOrders: ServiceOrder[];
  isLoading: boolean;
  createServiceOrder: (data: Omit<ServiceOrder, "id" | "created_at">) => void;
  updateServiceOrder: (id: number, data: Partial<ServiceOrder>) => void;
  deleteServiceOrder: (id: number) => void;
}

const ServiceOrderContext = createContext<ServiceOrderContextType | undefined>(undefined);

export function ServiceOrderProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: serviceOrders = [], isLoading } = useQuery({
    queryKey: ['serviceOrders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ServiceOrder[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (serviceOrder: Omit<ServiceOrder, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from('service_orders')
        .insert(serviceOrder)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceOrders'] });
      toast({
        title: "Ordem de Serviço criada",
        description: "A OS foi registrada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar OS",
        description: "Ocorreu um erro ao criar a ordem de serviço.",
        variant: "destructive",
      });
      console.error('Error creating service order:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ServiceOrder> }) => {
      const { data: updatedData, error } = await supabase
        .from('service_orders')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceOrders'] });
      toast({
        title: "Ordem de Serviço atualizada",
        description: "As alterações foram salvas com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar OS",
        description: "Ocorreu um erro ao atualizar a ordem de serviço.",
        variant: "destructive",
      });
      console.error('Error updating service order:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('service_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceOrders'] });
      toast({
        title: "Ordem de Serviço excluída",
        description: "A OS foi removida com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir OS",
        description: "Ocorreu um erro ao excluir a ordem de serviço.",
        variant: "destructive",
      });
      console.error('Error deleting service order:', error);
    },
  });

  const value = {
    serviceOrders,
    isLoading,
    createServiceOrder: createMutation.mutate,
    updateServiceOrder: (id: number, data: Partial<ServiceOrder>) => 
      updateMutation.mutate({ id, data }),
    deleteServiceOrder: deleteMutation.mutate,
  };

  return (
    <ServiceOrderContext.Provider value={value}>
      {children}
    </ServiceOrderContext.Provider>
  );
}

export function useServiceOrders() {
  const context = useContext(ServiceOrderContext);
  if (context === undefined) {
    throw new Error('useServiceOrders must be used within a ServiceOrderProvider');
  }
  return context;
}