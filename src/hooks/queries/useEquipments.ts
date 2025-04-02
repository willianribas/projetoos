
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Equipment {
  id: number;
  created_at: string;
  user_id: string;
  modelo: string;
  marca: string;
  tipo_equipamento: string;
  identificador: string;
  numero_serie: string;
}

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

      return data as Equipment[];
    },
  });
};
