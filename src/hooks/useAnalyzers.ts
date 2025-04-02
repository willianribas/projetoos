
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Analyzer, AnalyzerWithStatus } from '@/types/analyzer';
import { useToast } from '@/hooks/use-toast';
import { isBefore, addDays, parseISO } from 'date-fns';

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
    const sixtyDaysFromNow = addDays(today, 60);

    if (isBefore(dueDate, today)) {
      return { ...analyzer, status: 'expired' };
    } else if (isBefore(dueDate, sixtyDaysFromNow)) {
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

      const analyzersWithStatus = data.map(getAnalyzerStatus);
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
      const { data, error } = await supabase
        .from('analyzers')
        .insert({
          ...analyzerData,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newAnalyzerWithStatus = getAnalyzerStatus(data);
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
      const { data, error } = await supabase
        .from('analyzers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedAnalyzerWithStatus = getAnalyzerStatus(data);
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
