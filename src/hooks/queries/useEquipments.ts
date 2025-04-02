
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useEquipmentsQuery = () => {
  return useQuery({
    queryKey: ["equipments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipments")
        .select("*");

      if (error) {
        console.error("Error fetching equipments:", error);
        throw error;
      }

      return data;
    },
  });
};
