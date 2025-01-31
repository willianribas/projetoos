import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ServiceOrder } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ADENotificationProps {
  serviceOrders: ServiceOrder[];
}

const ADENotification = ({ serviceOrders }: ADENotificationProps) => {
  const [notifiedOrders, setNotifiedOrders] = useState<Set<number>>(new Set());
  const queryClient = useQueryClient();

  const createNotificationMutation = useMutation({
    mutationFn: async (serviceOrderId: number) => {
      const { error } = await supabase
        .from('notification_states')
        .insert({
          service_order_id: serviceOrderId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          notification_type: 'ADE_8_DAYS',
          is_read: false
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification_states"] });
    },
  });

  const calculateDays = (createdAt: string) => {
    return Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  useEffect(() => {
    const checkADEOrders = async () => {
      const adeOrders = serviceOrders.filter(order => {
        const days = calculateDays(order.created_at || "");
        return order.status === "ADE" && days >= 8 && !notifiedOrders.has(order.id);
      });

      for (const order of adeOrders) {
        const days = calculateDays(order.created_at || "");
        
        // Check if notification already exists and is not read
        const { data: existingNotification } = await supabase
          .from('notification_states')
          .select('*')
          .eq('service_order_id', order.id)
          .eq('notification_type', 'ADE_8_DAYS')
          .maybeSingle();

        if (!existingNotification) {
          try {
            await createNotificationMutation.mutateAsync(order.id);

            toast({
              title: "Ordem de Serviço em ADE",
              description: `A OS ${order.numeroos} do patrimônio ${order.patrimonio} (${order.equipamento}) está há ${days} dias em ADE.`,
              duration: 5000,
            });

            setNotifiedOrders(prev => new Set([...prev, order.id]));
          } catch (error) {
            console.error("Error creating notification:", error);
          }
        }
      }
    };

    checkADEOrders();
  }, [serviceOrders]);

  return null;
};

export default ADENotification;