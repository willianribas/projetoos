
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/hooks/use-toast";

export interface Notification {
  id: number;
  user_id: string;
  notification_type: string;
  service_order_id?: number;
  is_read: boolean;
  created_at: string;
  title?: string;
  description?: string;
  metadata?: any;
}

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [hasUnread, setHasUnread] = useState(false);

  // Query for notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notification_states", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("notification_states")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50); // Limit to latest 50 notifications

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notification_states',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification received:', payload);
          queryClient.invalidateQueries({ queryKey: ["notification_states", user.id] });
          
          // Show toast for new notification
          const newNotification = payload.new as Notification;
          toast({
            title: getNotificationTitle(newNotification.notification_type),
            description: getNotificationDescription(newNotification),
            duration: 6000,
            className: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-800",
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notification_states',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Notification updated:', payload);
          queryClient.invalidateQueries({ queryKey: ["notification_states", user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Check for unread notifications
  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.is_read).length;
    setHasUnread(unreadCount > 0);
  }, [notifications]);

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const { error } = await supabase
        .from("notification_states")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification_states", user?.id] });
    },
    onError: (error) => {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar a notificação como lida.",
        variant: "destructive",
      });
    },
  });

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notification_states")
        .update({ is_read: true })
        .eq("user_id", user?.id)
        .is("is_read", false);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification_states", user?.id] });
      toast({
        title: "✅ Sucesso",
        description: "Todas as notificações foram marcadas como lidas.",
        variant: "default",
        className: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800",
      });
    },
    onError: (error) => {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível marcar as notificações como lidas.",
        variant: "destructive",
      });
    },
  });

  // Delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const { error } = await supabase
        .from("notification_states")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification_states", user?.id] });
      toast({
        title: "🗑️ Notificação removida",
        description: "A notificação foi excluída com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Error deleting notification:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a notificação.",
        variant: "destructive",
      });
    },
  });

  // Clear all notifications
  const clearAllNotificationsMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notification_states")
        .delete()
        .eq("user_id", user?.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification_states", user?.id] });
      toast({
        title: "🧹 Limpeza concluída",
        description: "Todas as notificações foram removidas.",
        variant: "default",
        className: "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 dark:from-purple-950/20 dark:to-indigo-950/20 dark:border-purple-800",
      });
    },
    onError: (error) => {
      console.error("Error clearing all notifications:", error);
      toast({
        title: "Erro",
        description: "Não foi possível limpar todas as notificações.",
        variant: "destructive",
      });
    },
  });

  const markAsRead = (notificationId: number) => {
    markAsReadMutation.mutate(notificationId);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const deleteNotification = (notificationId: number) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  const clearAllNotifications = () => {
    clearAllNotificationsMutation.mutate();
  };

  return {
    notifications,
    hasUnread,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    unreadCount: notifications.filter(n => !n.is_read).length,
  };
}

// Helper functions
function getNotificationTitle(type: string): string {
  switch (type) {
    case "ADE_8_DAYS":
      return "⚠️ Alerta ADE";
    case "shared_service_order":
      return "📤 OS Compartilhada";
    case "ade_reminder":
      return "⏰ Lembrete ADE";
    case "status_update":
      return "🔄 Status Atualizado";
    case "deadline_reminder":
      return "⏰ Prazo se aproximando";
    default:
      return "🔔 Notificação";
  }
}

function getNotificationDescription(notification: Notification): string {
  switch (notification.notification_type) {
    case "ADE_8_DAYS":
      return "Uma ordem de serviço está há mais de 8 dias em ADE.";
    case "shared_service_order":
      return "Uma nova ordem de serviço foi compartilhada com você.";
    case "ade_reminder":
      return "Lembrete sobre ordem em status ADE.";
    case "status_update":
      return "O status de uma ordem de serviço foi atualizado.";
    case "deadline_reminder":
      return "Uma ordem de serviço está próxima do prazo.";
    default:
      return "Você tem uma nova notificação.";
  }
}
