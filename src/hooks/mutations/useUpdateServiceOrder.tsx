import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceOrder } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useUpdateServiceOrder = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updatedOrder
    }: ServiceOrder) => {
      const { data, error } = await supabase
        .from("service_orders")
        .update(updatedOrder)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_orders"] });
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