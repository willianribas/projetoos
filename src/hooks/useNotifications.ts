
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
}

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [hasUnread, setHasUnread] = useState(false);

  // Query for notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notification_states", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_states")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
  });

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
        title: "Notificações marcadas como lidas",
        description: "Todas as notificações foram marcadas como lidas.",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Erro ao marcar notificações",
        description: "Não foi possível marcar as notificações como lidas.",
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

  return {
    notifications,
    hasUnread,
    isLoading,
    markAsRead,
    markAllAsRead,
  };
}
