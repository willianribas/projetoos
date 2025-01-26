import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceOrder } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useCreateServiceOrder = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newOrder: Omit<ServiceOrder, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("service_orders")
        .insert([newOrder])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_orders"] });
      toast({
        title: "Ordem de Serviço criada",
        description: "A OS foi registrada com sucesso!",
        variant: "default",
        className: "bg-green-500 text-white border-none",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error creating service order:", error);
      toast({
        title: "Erro ao criar OS",
        description: "Ocorreu um erro ao tentar criar a ordem de serviço.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });
};