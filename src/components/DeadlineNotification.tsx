import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ServiceOrder } from "@/types";
import { Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DeadlineNotificationProps {
  serviceOrders: ServiceOrder[];
}

const DeadlineNotification = ({ serviceOrders }: DeadlineNotificationProps) => {
  const [notifiedDeadlines, setNotifiedDeadlines] = useState<Set<number>>(new Set());

  const calculateDaysUntilDeadline = (deadline: string) => {
    return Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  useEffect(() => {
    const checkDeadlines = async () => {
      const ordersWithDeadline = serviceOrders.filter(order => {
        if (!order.deadline || notifiedDeadlines.has(order.id)) return false;
        const daysUntil = calculateDaysUntilDeadline(order.deadline);
        return daysUntil <= 2 && daysUntil > 0;
      });

      for (const order of ordersWithDeadline) {
        const daysUntil = calculateDaysUntilDeadline(order.deadline!);
        
        // Verificar se já existe uma notificação não lida
        const { data: existingNotification } = await supabase
          .from('notification_states')
          .select('*')
          .eq('service_order_id', order.id)
          .eq('notification_type', 'DEADLINE_WARNING')
          .single();

        if (!existingNotification) {
          // Criar estado da notificação
          await supabase
            .from('notification_states')
            .insert({
              service_order_id: order.id,
              user_id: (await supabase.auth.getUser()).data.user?.id,
              notification_type: 'DEADLINE_WARNING',
              is_read: false
            });

          toast({
            title: "Prazo próximo do vencimento",
            description: `A OS ${order.numeroos} do patrimônio ${order.patrimonio} vence em ${daysUntil} ${daysUntil === 1 ? 'dia' : 'dias'}.`,
            duration: 5000,
            className: "bg-yellow-500 text-white border-none",
          });

          setNotifiedDeadlines(prev => new Set([...prev, order.id]));
        }
      }

      // Verificar OS com prazo vencido
      const overdueOrders = serviceOrders.filter(order => {
        if (!order.deadline || notifiedDeadlines.has(order.id)) return false;
        const daysUntil = calculateDaysUntilDeadline(order.deadline);
        return daysUntil <= 0;
      });

      for (const order of overdueOrders) {
        const { data: existingNotification } = await supabase
          .from('notification_states')
          .select('*')
          .eq('service_order_id', order.id)
          .eq('notification_type', 'DEADLINE_OVERDUE')
          .single();

        if (!existingNotification) {
          await supabase
            .from('notification_states')
            .insert({
              service_order_id: order.id,
              user_id: (await supabase.auth.getUser()).data.user?.id,
              notification_type: 'DEADLINE_OVERDUE',
              is_read: false
            });

          toast({
            title: "Prazo vencido",
            description: `A OS ${order.numeroos} do patrimônio ${order.patrimonio} está com o prazo vencido.`,
            duration: 5000,
            className: "bg-red-500 text-white border-none",
          });

          setNotifiedDeadlines(prev => new Set([...prev, order.id]));
        }
      }
    };

    checkDeadlines();
  }, [serviceOrders]);

  return null;
};

export default DeadlineNotification;