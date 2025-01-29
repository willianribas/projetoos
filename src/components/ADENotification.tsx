import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ServiceOrder } from "@/types";
import { BellRing } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ADENotificationProps {
  serviceOrders: ServiceOrder[];
}

const ADENotification = ({ serviceOrders }: ADENotificationProps) => {
  const [notifiedOrders, setNotifiedOrders] = useState<Set<number>>(new Set());

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

          // Show toast notification
          toast({
            title: (
              <div className="flex items-center gap-2">
                <BellRing className="h-4 w-4 text-blue-400" />
                <span>Ordem de Serviço em ADE</span>
              </div>
            ),
            description: (
              <div className="mt-1 text-sm">
                <p>
                  A OS {order.numeroos} do patrimônio {order.patrimonio} ({order.equipamento}) 
                  está há {days} dias em ADE.
                </p>
              </div>
            ),
            duration: 5000,
          });

          setNotifiedOrders(prev => new Set([...prev, order.id]));
        }
      }
    };

    checkADEOrders();
  }, [serviceOrders]);

  return null;
};

export default ADENotification;