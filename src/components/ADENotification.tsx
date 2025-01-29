import { useEffect } from "react";
import { ServiceOrder } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ADENotificationProps {
  serviceOrders: ServiceOrder[];
}

const ADENotification = ({ serviceOrders }: ADENotificationProps) => {
  const { toast } = useToast();

  const calculateDays = (createdAt: string) => {
    return Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  useEffect(() => {
    const checkADEOrders = async () => {
      const adeOrders = serviceOrders.filter(order => {
        const days = calculateDays(order.created_at || "");
        return order.status === "ADE" && days >= 8;
      });

      for (const order of adeOrders) {
        const days = calculateDays(order.created_at || "");
        
        // Check if notification already exists
        const { data: existingNotification } = await supabase
          .from('notification_states')
          .select('*')
          .eq('service_order_id', order.id)
          .eq('notification_type', 'ADE_8_DAYS')
          .eq('is_read', false)
          .single();

        if (!existingNotification) {
          // Create notification state
          await supabase
            .from('notification_states')
            .insert({
              service_order_id: order.id,
              user_id: (await supabase.auth.getUser()).data.user?.id,
              notification_type: 'ADE_8_DAYS',
              is_read: false
            });
        }
      }
    };

    checkADEOrders();
  }, [serviceOrders]);

  return null;
};

export default ADENotification;