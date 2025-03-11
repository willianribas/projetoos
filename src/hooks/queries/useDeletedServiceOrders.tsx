
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceOrder } from "@/types";
import { useAuth } from "@/components/AuthProvider";

export const useDeletedServiceOrdersQuery = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["deleted_service_orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_orders")
        .select("*")
        .eq('user_id', user?.id)
        .not('deleted_at', 'is', null)
        .order("deleted_at", { ascending: false });

      if (error) throw error;
      return data as ServiceOrder[];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};
