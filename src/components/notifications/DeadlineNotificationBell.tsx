import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { ServiceOrder } from "@/types";
import { differenceInDays, isPast } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DeadlineNotificationBellProps {
  serviceOrders: ServiceOrder[];
}

const DeadlineNotificationBell = ({ serviceOrders }: DeadlineNotificationBellProps) => {
  const [notifications, setNotifications] = useState<ServiceOrder[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const checkDeadlines = () => {
      const notificationsToShow = serviceOrders.filter((order) => {
        if (!order.deadline) return false;
        const deadlineDate = new Date(order.deadline);
        const daysUntilDeadline = differenceInDays(deadlineDate, new Date());
        return daysUntilDeadline <= 2 || isPast(deadlineDate);
      });

      setNotifications(notificationsToShow);
    };

    checkDeadlines();

    // Verificar notificações a cada minuto
    const interval = setInterval(checkDeadlines, 60000);

    return () => clearInterval(interval);
  }, [serviceOrders]);

  useEffect(() => {
    const channel = supabase
      .channel("deadline-notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "service_orders",
        },
        () => {
          // Atualizar notificações quando houver mudanças nas ordens de serviço
          const checkDeadlines = () => {
            const notificationsToShow = serviceOrders.filter((order) => {
              if (!order.deadline) return false;
              const deadlineDate = new Date(order.deadline);
              const daysUntilDeadline = differenceInDays(deadlineDate, new Date());
              return daysUntilDeadline <= 2 || isPast(deadlineDate);
            });

            setNotifications(notificationsToShow);
          };

          checkDeadlines();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [serviceOrders]);

  const markAsRead = async (orderId: number) => {
    try {
      const { error } = await supabase
        .from("notification_states")
        .insert([
          {
            service_order_id: orderId,
            notification_type: "deadline",
            is_read: true,
          },
        ]);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => n.id !== orderId));
      
      toast({
        title: "Notificação marcada como lida",
        description: "A notificação foi removida da sua lista.",
        variant: "default",
        className: "bg-green-500 text-white border-none",
      });
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar a notificação como lida.",
        variant: "destructive",
      });
    }
  };

  if (notifications.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 hover:bg-accent rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
          >
            {notifications.length}
          </Badge>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.map((order) => {
          const deadlineDate = new Date(order.deadline!);
          const daysUntilDeadline = differenceInDays(deadlineDate, new Date());
          const isOverdue = isPast(deadlineDate);

          return (
            <DropdownMenuItem
              key={order.id}
              className="flex flex-col items-start p-4 space-y-1 cursor-pointer"
              onClick={() => markAsRead(order.id)}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">OS #{order.numeroos}</span>
                <Badge
                  variant={isOverdue ? "destructive" : "warning"}
                  className="ml-2"
                >
                  {isOverdue
                    ? "Prazo vencido"
                    : `${daysUntilDeadline} dias restantes`}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{order.equipamento}</p>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DeadlineNotificationBell;