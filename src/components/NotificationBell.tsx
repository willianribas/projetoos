
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
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/components/AuthProvider";

type ServiceOrder = Database['public']['Tables']['service_orders']['Row'];

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('service-orders-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'service_orders',
          filter: `user_id=eq.${user.id}`, // Filter for current user only
        },
        (payload) => {
          const oldStatus = payload.old?.status;
          const newStatus = payload.new?.status;
          const orderNumber = payload.new?.numeroos;
          
          if (oldStatus && newStatus && orderNumber && oldStatus !== newStatus) {
            const notification = {
              id: new Date().getTime().toString(),
              message: `OS ${orderNumber} mudou de ${oldStatus} para ${newStatus}`,
              timestamp: new Date(),
            };
            
            setNotifications(prev => [notification, ...prev].slice(0, 10));
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setUnreadCount(0);
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
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
      <PopoverContent className="w-80 -mt-6" align="end">
        <div className="px-4 py-2 font-medium border-b">
          Notificações
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4">
                  <p className="text-sm text-foreground/90">{notification.message}</p>
                  <p className="text-xs text-foreground/60 mt-1">
                    {new Date(notification.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-foreground/60">
              Nenhuma notificação
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
