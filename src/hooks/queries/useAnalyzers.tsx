
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Analyzer, getAnalyzerStatus } from "@/types/analyzer";
import { useAuth } from "@/components/AuthProvider";

export const useAnalyzersQuery = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["analyzers", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analyzers")
        .select("*")
        .eq('user_id', user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Process the data to calculate status based on due dates
      return data.map((analyzer: any) => ({
        ...analyzer,
        calibration_due_date: new Date(analyzer.calibration_due_date),
        status: getAnalyzerStatus(analyzer.calibration_due_date, analyzer.in_calibration || false)
      })) as Analyzer[];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: true,
  });
};
