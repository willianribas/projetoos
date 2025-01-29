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
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ServiceOrder[];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};