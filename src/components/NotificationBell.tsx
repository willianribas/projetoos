import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { NotificationItem } from "./notifications/NotificationItem";
import { EmptyNotifications } from "./notifications/EmptyNotifications";
import { NotificationHeader } from "./notifications/NotificationHeader";

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  notificationId?: number;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const { data: notificationStates } = await supabase
      .from('notification_states')
      .select(`
        *,
        service_orders (*)
      `)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (notificationStates) {
      const formattedNotifications = notificationStates.map((notification: any) => {
        const serviceOrder = notification.service_orders;
        const days = Math.floor(
          (new Date().getTime() - new Date(serviceOrder.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        return {
          id: notification.id.toString(),
          message: `OS ${serviceOrder.numeroos} do patrimônio ${serviceOrder.patrimonio} está há ${days} dias em ADE`,
          timestamp: new Date(notification.created_at || new Date()),
          notificationId: notification.id
        };
      });

      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.length);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel('service-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notification_states',
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleNotificationClick = async (notificationId: number) => {
    await supabase
      .from('notification_states')
      .update({ is_read: true })
      .eq('id', notificationId);

    fetchNotifications();
  };

  return (
    <Popover>
      <PopoverTrigger className="relative">
        <Bell className="h-6 w-6 text-foreground/80 hover:text-foreground transition-colors" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-blue-500"
            variant="default"
          >
            {unreadCount}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <NotificationHeader />
        <ScrollArea className="h-[400px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  message={notification.message}
                  timestamp={notification.timestamp}
                  onClick={() => notification.notificationId && handleNotificationClick(notification.notificationId)}
                />
              ))}
            </div>
          ) : (
            <EmptyNotifications />
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;