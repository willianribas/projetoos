
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/useNotifications";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useSharedServiceOrders } from "@/hooks/useSharedServiceOrders";
import { useNotificationSound } from "@/lib/useNotificationSound";

export default function NotificationBell() {
  const { notifications, hasUnread, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { receivedOrders } = useSharedServiceOrders();
  const { play } = useNotificationSound();
  const [prevPendingShares, setPrevPendingShares] = useState(0);
  
  const pendingShares = receivedOrders.length;
  const hasSharedOrders = pendingShares > 0;
  
  // Play sound when new shared orders arrive
  useEffect(() => {
    if (pendingShares > prevPendingShares && pendingShares > 0) {
      play();
    }
    setPrevPendingShares(pendingShares);
  }, [pendingShares, prevPendingShares, play]);

  const renderNotificationType = (type: string) => {
    switch (type) {
      case "shared_service_order":
        return "Ordem de serviço compartilhada";
      case "ade_reminder":
        return "Lembrete ADE";
      default:
        return "Notificação";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {(hasUnread || hasSharedOrders) && (
            <span className="absolute h-2.5 w-2.5 top-1 right-1.5 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <h4 className="font-semibold">Notificações</h4>
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Marcar todas como lidas
          </Button>
        </div>

        {hasSharedOrders && (
          <div className="p-2 my-2 bg-purple-100 dark:bg-purple-900/20 rounded-md border border-purple-200 dark:border-purple-800/30">
            <p className="text-sm font-medium flex items-center justify-between">
              Ordens compartilhadas pendentes
              <Badge variant="outline" className="ml-2 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                {pendingShares}
              </Badge>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Você tem {pendingShares} ordem(s) compartilhada(s) aguardando sua aprovação.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/30"
              onClick={() => {
                setOpen(false);
                navigate("/");
              }}
            >
              Ver ordens compartilhadas
            </Button>
          </div>
        )}

        {notifications.length > 0 ? (
          <ScrollArea className="h-[300px]">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b last:border-b-0 cursor-pointer ${
                  !notification.is_read
                    ? "bg-muted/50"
                    : ""
                }`}
                onClick={() => {
                  setOpen(false);
                  // Handle notification click based on type
                  if (notification.notification_type === "shared_service_order") {
                    navigate("/");
                  }
                }}
              >
                <div className="flex justify-between items-start">
                  <h5 className="font-medium text-sm">
                    {renderNotificationType(notification.notification_type)}
                  </h5>
                  {!notification.is_read && (
                    <Badge variant="default" className="ml-2 h-1.5 w-1.5 rounded-full p-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.notification_type === "shared_service_order" && 
                    "Uma nova ordem de serviço foi compartilhada com você."}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {format(
                    new Date(notification.created_at),
                    "dd/MM/yyyy HH:mm"
                  )}
                </p>
              </div>
            ))}
          </ScrollArea>
        ) : (
          <div className="py-4 text-center text-muted-foreground text-sm">
            Nenhuma notificação no momento.
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
