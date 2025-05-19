
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellDot } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

export default function NotificationBell() {
  const { notifications, hasUnread, markAllAsRead, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { receivedOrders } = useSharedServiceOrders();
  const { play } = useNotificationSound();
  const [prevPendingShares, setPrevPendingShares] = useState(0);
  
  const pendingShares = receivedOrders.length;
  const hasSharedOrders = pendingShares > 0;
  const totalUnread = notifications.filter(n => !n.is_read).length + pendingShares;
  
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

  const renderNotificationContent = (type: string) => {
    switch (type) {
      case "shared_service_order":
        return "Uma nova ordem de serviço foi compartilhada com você.";
      case "ade_reminder":
        return "Você tem um lembrete ADE pendente para revisar.";
      default:
        return "Nova notificação do sistema.";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {totalUnread > 0 ? (
            <>
              <BellDot className="h-[1.2rem] w-[1.2rem] text-purple-500" />
              <span className="absolute h-4 w-4 top-0 right-0 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                {totalUnread}
              </span>
            </>
          ) : (
            <Bell className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex justify-between items-center p-3 border-b">
          <h4 className="font-semibold text-purple-700 dark:text-purple-300">Notificações</h4>
          {totalUnread > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {hasSharedOrders && (
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Ordens compartilhadas pendentes
              </p>
              <Badge variant="outline" className="ml-2 bg-purple-500/20 text-purple-700 dark:text-purple-300">
                {pendingShares}
              </Badge>
            </div>
            <p className="text-xs text-purple-600/80 dark:text-purple-400/80 mt-1">
              Você tem {pendingShares} ordem(s) compartilhada(s) aguardando sua ação.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50"
              onClick={() => {
                setOpen(false);
                navigate("/");
              }}
            >
              Ver ordens compartilhadas
            </Button>
          </div>
        )}

        <ScrollArea className="max-h-[320px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 cursor-pointer transition-colors ${
                    !notification.is_read
                      ? "bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-100/50 dark:hover:bg-blue-900/20"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => {
                    if (!notification.is_read) {
                      markAsRead(notification.id);
                    }
                    setOpen(false);
                    // Handle notification click based on type
                    if (notification.notification_type === "shared_service_order") {
                      navigate("/");
                    }
                  }}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm flex items-center">
                        {renderNotificationType(notification.notification_type)}
                        {!notification.is_read && (
                          <Badge variant="default" className="ml-2 h-1.5 w-1.5 rounded-full p-0 bg-blue-500" />
                        )}
                      </h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        {renderNotificationContent(notification.notification_type)}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1.5">
                        {format(
                          new Date(notification.created_at),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground text-sm">
              Nenhuma notificação no momento.
            </div>
          )}
        </ScrollArea>
        
        {(hasSharedOrders || notifications.length > 0) && (
          <div className="p-2 border-t bg-muted/30">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs text-muted-foreground"
              onClick={() => {
                setOpen(false);
              }}
            >
              Fechar
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
