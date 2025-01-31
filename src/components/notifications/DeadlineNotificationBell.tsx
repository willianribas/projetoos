import React, { useEffect, useState } from "react";
import { Bell, AlertTriangle, CheckCircle } from "lucide-react";
import { ServiceOrder } from "@/types";
import { differenceInDays, isPast, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useServiceOrders } from "../ServiceOrderProvider";
import { Button } from "@/components/ui/button";

const DeadlineNotificationBell = () => {
  const { serviceOrders } = useServiceOrders();
  const [notifications, setNotifications] = useState<ServiceOrder[]>([]);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkDeadlines = () => {
      const notificationsToShow = serviceOrders.filter((order) => {
        if (!order.deadline) return false;
        const deadlineDate = new Date(order.deadline);
        const daysUntilDeadline = differenceInDays(deadlineDate, new Date());
        return (daysUntilDeadline <= 2 && order.status !== "OSP") || (isPast(deadlineDate) && order.status !== "OSP");
      });

      setNotifications(notificationsToShow);
    };

    checkDeadlines();
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
          const checkDeadlines = () => {
            const notificationsToShow = serviceOrders.filter((order) => {
              if (!order.deadline || order.status === "OSP") return false;
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
      setIsOpen(false);
      
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

  const markAllAsRead = async () => {
    try {
      const promises = notifications.map((order) =>
        supabase
          .from("notification_states")
          .insert([
            {
              service_order_id: order.id,
              notification_type: "deadline",
              is_read: true,
            },
          ])
      );

      await Promise.all(promises);
      setNotifications([]);
      setIsOpen(false);

      toast({
        title: "Todas as notificações foram marcadas como lidas",
        description: "Sua lista de notificações foi limpa.",
        variant: "default",
        className: "bg-green-500 text-white border-none",
      });
    } catch (error) {
      console.error("Erro ao marcar todas as notificações como lidas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar todas as notificações como lidas.",
        variant: "destructive",
      });
    }
  };

  if (notifications.length === 0) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
          >
            {notifications.length}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-semibold">Notificações de Prazo</span>
          {notifications.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.map((order) => {
            const deadlineDate = new Date(order.deadline!);
            const daysUntilDeadline = differenceInDays(deadlineDate, new Date());
            const isOverdue = isPast(deadlineDate);

            return (
              <DropdownMenuItem
                key={order.id}
                className="flex flex-col items-start p-4 space-y-2 cursor-pointer hover:bg-accent"
                onClick={() => markAsRead(order.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {isOverdue ? (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-orange-500" />
                    )}
                    <span className="font-medium">OS #{order.numeroos}</span>
                  </div>
                  <Badge
                    variant={isOverdue ? "destructive" : "secondary"}
                    className="ml-2"
                  >
                    {isOverdue
                      ? "Prazo vencido"
                      : `${daysUntilDeadline} dias restantes`}
                  </Badge>
                </div>
                <div className="w-full space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {order.equipamento}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {order.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Prazo: {format(deadlineDate, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DeadlineNotificationBell;