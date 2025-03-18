
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ServiceOrder } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";

interface ADENotificationProps {
  serviceOrders: ServiceOrder[];
}

const ADENotification = ({ serviceOrders }: ADENotificationProps) => {
  const [notifiedOrders, setNotifiedOrders] = useState<Set<number>>(new Set());
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const createNotificationMutation = useMutation({
    mutationFn: async ({ serviceOrderId, notificationType }: { serviceOrderId: number; notificationType: string }) => {
      const { error } = await supabase
        .from('notification_states')
        .insert({
          service_order_id: serviceOrderId,
          user_id: user?.id,
          notification_type: notificationType,
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
    const checkStatusOrders = async () => {
      // Filter orders to only include those owned by the current user
      if (!user) return;
      
      const userOrders = serviceOrders.filter(order => order.user_id === user.id);
      
      // Check for ADE orders
      const adeOrders = userOrders.filter(order => {
        const days = calculateDays(order.created_at || "");
        return order.status === "ADE" && days >= 8 && !notifiedOrders.has(order.id);
      });

      // Check for ADPD orders
      const adpdOrders = userOrders.filter(order => 
        order.status === "ADPD" && !notifiedOrders.has(order.id)
      );

      // Handle ADE notifications
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
            await createNotificationMutation.mutateAsync({
              serviceOrderId: order.id,
              notificationType: 'ADE_8_DAYS'
            });

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

      // Handle ADPD notifications
      if (adpdOrders.length > 0) {
        const serviceOrdersCount = adpdOrders.length;
        
        // Create group notification for ADPD orders
        toast({
          title: "Ordens de Serviço em ADPD",
          description: `Você tem ${serviceOrdersCount} ${serviceOrdersCount === 1 ? 'OS' : 'ordens de serviço'} aguardando decisão de proposta de desativação.`,
          duration: 5000,
        });
        
        // Mark as notified
        adpdOrders.forEach(order => {
          setNotifiedOrders(prev => new Set([...prev, order.id]));
        });
      }
    };

    if (user) {
      checkStatusOrders();
    }
  }, [serviceOrders, user]);

  return null;
};

export default ADENotification;
