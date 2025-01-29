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
  read: boolean;
  type: 'ade-warning' | 'status-change';
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Verificar OSs em ADE com mais de 8 dias
    const checkADEOrders = async () => {
      const { data: orders, error } = await supabase
        .from('service_orders')
        .select('*')
        .eq('status', 'ADE')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching ADE orders:', error);
        return;
      }

      orders.forEach(order => {
        const createdDate = new Date(order.created_at);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 8) {
          const existingNotification = notifications.find(
            n => n.type === 'ade-warning' && n.message.includes(order.numeroos)
          );

          if (!existingNotification) {
            const notification = {
              id: `ade-${order.id}-${Date.now()}`,
              message: `OS ${order.numeroos} está em ADE há ${diffDays} dias`,
              timestamp: new Date(),
              read: false,
              type: 'ade-warning' as const
            };
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        }
      });
    };

    checkADEOrders();
    const interval = setInterval(checkADEOrders, 1000 * 60 * 60); // Verificar a cada hora

    const channel = supabase
      .channel('service-orders-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'service_orders',
          filter: `user_id=eq.${user.id}`
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
              read: false,
              type: 'status-change' as const
            };
            
            setNotifications(prev => [notification, ...prev].slice(0, 50));
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleNotificationClick = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId
          ? { ...n, read: true }
          : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <Popover>
      <PopoverTrigger className="relative">
        <Bell className="h-6 w-6 text-foreground/80 hover:text-foreground transition-colors" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-blue-500 animate-pulse"
            variant="default"
          >
            {unreadCount}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="px-4 py-2 font-medium border-b">
          Notificações
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
                    !notification.read ? 'bg-accent/50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
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