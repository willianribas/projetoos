
import React, { useState } from "react";
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

export default function NotificationBell() {
  const { notifications, hasUnread, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { receivedOrders } = useSharedServiceOrders();
  
  const pendingShares = receivedOrders.length;
  const hasSharedOrders = pendingShares > 0;

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
          <div className="p-2 my-2 bg-orange-100 dark:bg-orange-900/20 rounded-md">
            <p className="text-sm font-medium flex items-center justify-between">
              Ordens compartilhadas pendentes
              <Badge variant="outline" className="ml-2">
                {pendingShares}
              </Badge>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Você tem {pendingShares} ordens compartilhadas aguardando sua aprovação.
            </p>
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
