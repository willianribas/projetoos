import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, rpc } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { ServiceOrder } from "@/types";
import { toast } from "@/hooks/use-toast";

interface UseADEDaysNotificationsProps {
  serviceOrders: ServiceOrder[];
}

export const useADEDaysNotifications = ({ serviceOrders }: UseADEDaysNotificationsProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createNotificationMutation = useMutation({
    mutationFn: async ({ serviceOrderId, notificationType, days, order }: { 
      serviceOrderId: number; 
      notificationType: string;
      days: number;
      order: ServiceOrder;
    }) => {
      if (!user) throw new Error("User not authenticated");
      
      // Create notification with detailed metadata
      const { error } = await supabase
        .from('notification_states')
        .insert({
          service_order_id: serviceOrderId,
          user_id: user.id,
          notification_type: notificationType,
          is_read: false
        });

      if (error) throw error;
      
      return { serviceOrderId, notificationType, days, order };
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

  const getNotificationData = (days: number) => {
    if (days >= 8) {
      return {
        type: 'ADE_8_DAYS',
        urgency: 'URGENTE',
        className: "bg-gradient-to-r from-red-50 to-red-100 border-red-200 dark:from-red-950/20 dark:to-red-900/20 dark:border-red-800"
      };
    } else if (days >= 5) {
      return {
        type: 'ADE_5_DAYS',
        urgency: 'ATENÇÃO',
        className: "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 dark:from-orange-950/20 dark:to-orange-900/20 dark:border-orange-800"
      };
    } else if (days >= 3) {
      return {
        type: 'ADE_3_DAYS',
        urgency: 'AVISO',
        className: "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-950/20 dark:to-yellow-900/20 dark:border-yellow-800"
      };
    }
    return null;
  };

  useEffect(() => {
    const checkADENotifications = async () => {
      if (!user) return;
      
      const userOrders = serviceOrders.filter(order => 
        order.user_id === user.id && order.status === "ADE"
      );

      for (const order of userOrders) {
        const days = calculateDays(order.created_at || "");
        const notificationData = getNotificationData(days);
        
        if (!notificationData) continue;

        // Check if notification already exists for this specific threshold and user
        const { data: existingNotification } = await supabase
          .from('notification_states')
          .select('*')
          .eq('service_order_id', order.id)
          .eq('user_id', user.id)
          .eq('notification_type', notificationData.type)
          .maybeSingle();

        if (!existingNotification) {
          try {
            await createNotificationMutation.mutateAsync({
              serviceOrderId: order.id,
              notificationType: notificationData.type,
              days,
              order
            });

            // Show toast notification for this specific user with detailed OS info
            toast({
              title: `⚠️ ${notificationData.urgency} - OS #${order.numeroos} em ADE`,
              description: `Patrimônio: ${order.patrimonio} | Equipamento: ${order.equipamento} | ${days} dias em ADE`,
              duration: 8000,
              className: notificationData.className,
            });
          } catch (error) {
            console.error("Error creating ADE notification:", error);
          }
        }
      }
    };

    if (user && serviceOrders.length > 0) {
      // Run check every time service orders change or on mount
      checkADENotifications();
      
      // Set up interval to check periodically (every 30 minutes)
      const interval = setInterval(checkADENotifications, 30 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [serviceOrders, user]);

  return {
    isLoading: createNotificationMutation.isPending
  };
};