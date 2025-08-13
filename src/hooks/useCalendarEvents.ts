import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { useAuth } from "@/components/AuthProvider";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useCalendarEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch calendar events (using reminders table)
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["calendar-events", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("due_date", { ascending: true });

      if (error) {
        console.error("Error fetching calendar events:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar eventos do calendário",
          variant: "destructive",
        });
        throw error;
      }

      return data as CalendarEvent[];
    },
    enabled: !!user?.id,
  });

  // Create event mutation
  const createMutation = useMutation({
    mutationFn: async (newEvent: {
      title: string;
      description?: string;
      due_date?: string;
    }) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("reminders")
        .insert({
          ...newEvent,
          user_id: user.id,
          is_completed: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["reminders", user?.id] });
    },
    onError: (error) => {
      console.error("Error creating calendar event:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar evento",
        variant: "destructive",
      });
    },
  });

  // Update event mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedEvent: CalendarEvent) => {
      const { data, error } = await supabase
        .from("reminders")
        .update({
          title: updatedEvent.title,
          description: updatedEvent.description,
          due_date: updatedEvent.due_date,
          is_completed: updatedEvent.is_completed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedEvent.id)
        .eq("user_id", user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["reminders", user?.id] });
    },
    onError: (error) => {
      console.error("Error updating calendar event:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar evento",
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from("reminders")
        .delete()
        .eq("id", eventId)
        .eq("user_id", user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["reminders", user?.id] });
    },
    onError: (error) => {
      console.error("Error deleting calendar event:", error);
      toast({
        title: "Erro",
        description: "Falha ao excluir evento",
        variant: "destructive",
      });
    },
  });

  const createEvent = async (event: {
    title: string;
    description?: string;
    due_date?: string;
  }) => {
    return createMutation.mutateAsync(event);
  };

  const updateEvent = async (event: CalendarEvent) => {
    return updateMutation.mutateAsync(event);
  };

  const deleteEvent = async (eventId: string) => {
    return deleteMutation.mutateAsync(eventId);
  };

  return {
    events,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};