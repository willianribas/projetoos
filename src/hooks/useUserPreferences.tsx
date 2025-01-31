import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export interface DashboardLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

interface UserPreferencesDB {
  id: number;
  user_id: string;
  dashboard_layout: Json;
  created_at: string;
  updated_at: string;
}

// Layout padrão do dashboard
const defaultDashboardLayout: DashboardLayout[] = [
  { i: "0", x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 2 }, // MetricsHighlight
  { i: "1", x: 0, y: 4, w: 12, h: 4, minW: 6, minH: 2 }, // ADEMonitor
  { i: "2", x: 0, y: 8, w: 12, h: 8, minW: 6, minH: 4 }, // ServiceOrderContent
];

export const useUserPreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ["userPreferences", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching user preferences:", error);
        return { dashboard_layout: defaultDashboardLayout };
      }

      const typedData = data as UserPreferencesDB;

      // Parse the JSON data and ensure it matches our expected type
      return {
        dashboard_layout: (typedData?.dashboard_layout as unknown as DashboardLayout[]) || defaultDashboardLayout
      };
    },
    enabled: !!user?.id,
  });

  const { mutate: updateLayout } = useMutation({
    mutationFn: async (layout: DashboardLayout[]) => {
      if (!user?.id) return;

      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          dashboard_layout: layout as unknown as Json,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences", user?.id] });
      toast.success("Layout salvo com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating layout:", error);
      toast.error("Erro ao salvar layout");
    },
  });

  return {
    preferences,
    isLoading,
    updateLayout,
  };
};