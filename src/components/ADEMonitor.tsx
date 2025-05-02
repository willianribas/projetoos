
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Trash2 } from "lucide-react";
import { ServiceOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNotifications, CustomNotification } from "@/contexts/NotificationContext";
import AddNotificationDialog from "./AddNotificationDialog";

interface ADEMonitorProps {
  serviceOrders: ServiceOrder[];
}

const ADEMonitor = ({ serviceOrders }: ADEMonitorProps) => {
  const navigate = useNavigate();
  const { notifications, removeNotification } = useNotifications();
  
  const adeOrders = serviceOrders.filter(order => order.status === "ADE");
  const criticalAdeOrders = adeOrders.filter(order => order.priority === "critical");
  const adpdOrders = serviceOrders.filter(order => order.status === "ADPD");
  const msOrders = serviceOrders.filter(order => order.status === "M.S");

  const hasSystemNotifications = adeOrders.length > 0 || msOrders.length > 0 || adpdOrders.length > 0;
  const hasCustomNotifications = notifications.length > 0;

  if (!hasSystemNotifications && !hasCustomNotifications) {
    return null;
  }

  // Calculate days for each ADE order
  const calculateDays = (createdAt: string): number => {
    return Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  // Find the oldest ADE order
  const adeOrdersWithDays = adeOrders.map(order => ({
    ...order,
    days: calculateDays(order.created_at || "")
  }));
  
  // Sort by days in descending order to get the oldest one first
  adeOrdersWithDays.sort((a, b) => b.days - a.days);
  
  // Get the oldest order's days
  const oldestAdeDays = adeOrdersWithDays.length > 0 ? adeOrdersWithDays[0].days : 0;
  
  // Determine color based on days
  const getDaysColor = (days: number): string => {
    if (days >= 6) return "text-red-500 font-bold";
    if (days >= 3) return "text-orange-500 font-medium";
    return "text-green-500";
  };

  const formatNotificationDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  // Render a notification item
  const NotificationItem = ({ notification }: { notification: CustomNotification }) => (
    <div className="flex items-start justify-between gap-2 border-b border-border/40 pb-3 last:border-0 last:pb-0">
      <div className="flex-grow">
        <h4 className="text-sm font-medium text-foreground">{notification.title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
        <span className="text-xs text-blue-400 mt-1 block">
          {formatNotificationDate(notification.createdAt)}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-red-400 hover:text-red-600 hover:bg-red-100/10"
        onClick={() => removeNotification(notification.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <Card className="mb-6 sm:mb-8 mt-3 sm:mt-4 border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between py-3 sm:py-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 animate-pulse" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Notificações
          </span>
        </CardTitle>
        <AddNotificationDialog />
      </CardHeader>
      <CardContent className="pb-3 sm:pb-4">
        <div className="space-y-3 sm:space-y-4">
          {/* System notifications */}
          <div className="space-y-2 text-left">
            {adeOrders.length > 0 && (
              <p className="text-sm sm:text-base text-foreground/90">
                Você tem <span className="font-bold text-blue-400">{adeOrders.length}</span> {adeOrders.length === 1 ? 'OS' : 'ordens de serviço'} em ADE 
                {oldestAdeDays > 0 && (
                  <span> há <span className={getDaysColor(oldestAdeDays)}>{oldestAdeDays}</span> dias</span>
                )}.
              </p>
            )}
            
            {adpdOrders.length > 0 && (
              <p className="text-sm sm:text-base text-foreground/90">
                Você tem <span className="font-bold text-fuchsia-400">{adpdOrders.length}</span> {adpdOrders.length === 1 ? 'OS' : 'ordens de serviço'} em ADPD.
              </p>
            )}
            
            {criticalAdeOrders.length > 0 && (
              <p className="text-sm sm:text-base text-foreground/90">
                Você tem <span className="text-red-500 font-bold animate-pulse">{criticalAdeOrders.length}</span> {criticalAdeOrders.length === 1 ? 'OS marcada' : 'ordens de serviço marcadas'} como Crítica.
              </p>
            )}

            {msOrders.length > 0 && (
              <p className="text-xs sm:text-sm text-foreground/90 animate-fade-in text-left">
                Material Solicitado na O.S: {msOrders.map((order, index) => (
                  <React.Fragment key={order.id}>
                    <span className="font-medium hover:text-primary transition-colors">{order.numeroos}</span>
                    {index < msOrders.length - 1 && " | "}
                  </React.Fragment>
                ))}
              </p>
            )}
          </div>
          
          {/* User's custom notifications */}
          {notifications.length > 0 && (
            <div className="mt-4 space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Notificações personalizadas</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {notifications.map(notification => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-2">
            <Button 
              variant="outline"
              onClick={() => navigate('/ade-monitor')}
              className="hover:bg-blue-500/10 transition-colors duration-300 hover:scale-105"
              size="sm"
            >
              Ver detalhes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ADEMonitor;
