
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceOrder } from "@/types";
import { useAuth } from "@/components/AuthProvider";

export const useServiceOrdersQuery = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["service_orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_orders")
        .select("*")
        .eq('user_id', user?.id)
        .is('deleted_at', null) // Only get non-deleted items
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ServiceOrder[];
    },
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds for more frequent updates
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true,
    refetchInterval: 1000 * 60, // Auto-refetch every minute
  });
};
