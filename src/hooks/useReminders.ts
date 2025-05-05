
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';

export interface Reminder {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useReminders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ['reminders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true, nullsLast: true });
        
      if (error) {
        toast({
          title: 'Erro ao carregar lembretes',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      return data as Reminder[];
    },
    enabled: !!user,
  });
  
  const createMutation = useMutation({
    mutationFn: async (reminderData: Omit<Reminder, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('reminders')
        .insert([{ ...reminderData, user_id: user.id }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', user?.id] });
      toast({
        title: 'Lembrete criado',
        description: 'Seu lembrete foi salvo com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar lembrete',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async (reminder: Reminder) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('reminders')
        .update({
          title: reminder.title,
          description: reminder.description,
          due_date: reminder.due_date,
          is_completed: reminder.is_completed,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reminder.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      return reminder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', user?.id] });
      toast({
        title: 'Lembrete atualizado',
        description: 'Seu lembrete foi atualizado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar lembrete',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', user?.id] });
      toast({
        title: 'Lembrete excluído',
        description: 'Seu lembrete foi excluído com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir lembrete',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const createReminder = (reminderData: Omit<Reminder, 'id' | 'created_at' | 'updated_at'>) => {
    createMutation.mutate(reminderData);
  };
  
  const updateReminder = (reminder: Reminder) => {
    updateMutation.mutate(reminder);
  };
  
  const deleteReminder = (id: string) => {
    deleteMutation.mutate(id);
  };
  
  const toggleComplete = (reminder: Reminder) => {
    updateMutation.mutate({
      ...reminder,
      is_completed: !reminder.is_completed,
    });
  };
  
  return {
    reminders,
    isLoading,
    createReminder,
    updateReminder,
    deleteReminder,
    toggleComplete,
  };
};
