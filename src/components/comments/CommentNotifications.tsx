import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export const CommentNotifications = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("comment-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "service_order_comments",
          filter: `user_id=neq.${user.id}`,
        },
        async (payload) => {
          const { data: serviceOrder } = await supabase
            .from("service_orders")
            .select("numeroos")
            .eq("id", payload.new.service_order_id)
            .single();

          if (serviceOrder) {
            toast({
              title: "Novo comentário",
              description: `Novo comentário na OS ${serviceOrder.numeroos}`,
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return null;
};