
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Analyzer, AnalyzerWithStatus, AnalyzerStatus } from '@/types/analyzer';
import { useToast } from '@/hooks/use-toast';
import { isBefore, addDays, parseISO, format } from 'date-fns';

export const useAnalyzers = () => {
  const [analyzers, setAnalyzers] = useState<AnalyzerWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const getAnalyzerStatus = (analyzer: Analyzer): AnalyzerWithStatus => {
    if (analyzer.in_calibration) {
      return { ...analyzer, status: 'in-calibration' };
    }

    const today = new Date();
    const dueDate = parseISO(analyzer.calibration_due_date);
    const thirtyDaysFromNow = addDays(today, 30); // Changed from 60 to 30 days

    if (isBefore(dueDate, today)) {
      return { ...analyzer, status: 'expired' };
    } else if (isBefore(dueDate, thirtyDaysFromNow)) {
      return { ...analyzer, status: 'expiring-soon' };
    } else {
      return { ...analyzer, status: 'in-day' };
    }
  };

  const fetchAnalyzers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('analyzers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const analyzersWithStatus = data.map((item: Analyzer) => getAnalyzerStatus(item));
      setAnalyzers(analyzersWithStatus);
    } catch (error: any) {
      console.error('Error fetching analyzers:', error);
      toast({
        title: 'Erro ao carregar analisadores',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addAnalyzer = async (analyzerData: Omit<Analyzer, 'id' | 'created_at' | 'user_id'>) => {
    try {
      // Ensure calibration_due_date is in the format 'YYYY-MM-01'
      let formattedDate = analyzerData.calibration_due_date;
      if (formattedDate) {
        // Parse the date and set day to 1
        const dateObj = parseISO(formattedDate);
        formattedDate = format(dateObj, 'yyyy-MM-01');
      } else {
        // Use current date with day set to 1 if no date provided
        formattedDate = format(new Date(), 'yyyy-MM-01');
      }

      // Convert empty strings to dash
      const formattedData = {
        ...analyzerData,
        serial_number: analyzerData.serial_number || '-',
        model: analyzerData.model || '-',
        brand: analyzerData.brand || '-',
        calibration_due_date: formattedDate,
      };

      const { data, error } = await supabase
        .from('analyzers')
        .insert({
          ...formattedData,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newAnalyzerWithStatus = getAnalyzerStatus(data as Analyzer);
      setAnalyzers(prev => [newAnalyzerWithStatus, ...prev]);

      toast({
        title: 'Analisador adicionado',
        description: 'O analisador foi adicionado com sucesso!',
      });
    } catch (error: any) {
      console.error('Error adding analyzer:', error);
      toast({
        title: 'Erro ao adicionar analisador',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateAnalyzer = async (id: string, updateData: Partial<Analyzer>) => {
    try {
      // Format date if it's being updated
      if (updateData.calibration_due_date) {
        const dateObj = parseISO(updateData.calibration_due_date);
        updateData.calibration_due_date = format(dateObj, 'yyyy-MM-01');
      }

      // Convert empty strings to dash
      const formattedData = {
        ...updateData,
        serial_number: updateData.serial_number === '' ? '-' : updateData.serial_number,
        model: updateData.model === '' ? '-' : updateData.model,
        brand: updateData.brand === '' ? '-' : updateData.brand,
      };

      const { data, error } = await supabase
        .from('analyzers')
        .update(formattedData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedAnalyzerWithStatus = getAnalyzerStatus(data as Analyzer);
      setAnalyzers(prev => 
        prev.map(analyzer => 
          analyzer.id === id ? updatedAnalyzerWithStatus : analyzer
        )
      );

      toast({
        title: 'Analisador atualizado',
        description: 'O analisador foi atualizado com sucesso!',
      });
    } catch (error: any) {
      console.error('Error updating analyzer:', error);
      toast({
        title: 'Erro ao atualizar analisador',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteAnalyzer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('analyzers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setAnalyzers(prev => prev.filter(analyzer => analyzer.id !== id));

      toast({
        title: 'Analisador removido',
        description: 'O analisador foi removido com sucesso!',
      });
    } catch (error: any) {
      console.error('Error deleting analyzer:', error);
      toast({
        title: 'Erro ao remover analisador',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnalyzers();
    }
  }, [user]);

  return {
    analyzers,
    loading,
    addAnalyzer,
    updateAnalyzer,
    deleteAnalyzer,
    refresh: fetchAnalyzers,
  };
};
