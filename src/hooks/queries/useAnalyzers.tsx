
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Analyzer } from "@/types/analyzer";
import { format, parseISO, addDays, isAfter, isBefore } from "date-fns";

export const useAnalyzersQuery = () => {
  return useQuery({
    queryKey: ["analyzers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analyzers")
        .select("*");

      if (error) {
        console.error("Error fetching analyzers:", error);
        throw error;
      }

      // Calculate the status for each analyzer
      const analyzersWithStatus = data.map((analyzer: any) => {
        const dueDate = parseISO(analyzer.calibration_due_date);
        const today = new Date();
        const sixtyDaysFromNow = addDays(today, 60);
        
        let status: Analyzer['status'] = 'em_dia';
        
        if (analyzer.in_calibration) {
          status = 'em_calibracao';
        } else if (isBefore(dueDate, today)) {
          status = 'vencido';
        } else if (isBefore(dueDate, sixtyDaysFromNow)) {
          status = 'vencera';
        }
        
        return {
          ...analyzer,
          status
        };
      });

      return analyzersWithStatus as Analyzer[];
    },
  });
};
