
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ServiceOrder } from "@/types";
import { useAuth } from "./AuthProvider";
import { useADEDaysNotifications } from "@/hooks/useADEDaysNotifications";

interface ADENotificationProps {
  serviceOrders: ServiceOrder[];
}

const ADENotification = ({ serviceOrders }: ADENotificationProps) => {
  const [notifiedOrders, setNotifiedOrders] = useState<Set<number>>(new Set());
  const { user } = useAuth();
  
  // Use the new ADE days notifications hook
  useADEDaysNotifications({ serviceOrders });

  const calculateDays = (createdAt: string) => {
    return Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  useEffect(() => {
    const checkStatusOrders = async () => {
      // Filter orders to only include those owned by the current user
      if (!user) return;
      
      const userOrders = serviceOrders.filter(order => order.user_id === user.id);
      
      // Check for ADPD orders
      const adpdOrders = userOrders.filter(order => 
        order.status === "ADPD" && !notifiedOrders.has(order.id)
      );

      // Handle ADPD notifications
      if (adpdOrders.length > 0) {
        const serviceOrdersCount = adpdOrders.length;
        
        // Create group notification for ADPD orders
        toast({
          title: "📋 Ordens de Serviço em ADPD",
          description: `Você tem ${serviceOrdersCount} ${serviceOrdersCount === 1 ? 'OS' : 'ordens de serviço'} aguardando decisão de proposta de desativação.`,
          duration: 8000,
          className: "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 dark:from-purple-950/20 dark:to-indigo-950/20 dark:border-purple-800",
        });
        
        // Mark as notified
        adpdOrders.forEach(order => {
          setNotifiedOrders(prev => new Set([...prev, order.id]));
        });
      }
    };

    if (user) {
      checkStatusOrders();
    }
  }, [serviceOrders, user]);

  return null;
};

export default ADENotification;
