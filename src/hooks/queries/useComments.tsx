import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Comment } from "@/types";

export const useComments = (serviceOrderId: number) => {
  return useQuery({
    queryKey: ["comments", serviceOrderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_order_comments")
        .select("*")
        .eq("service_order_id", serviceOrderId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Comment[];
    },
  });
};