import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Comment } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useCommentMutations = (serviceOrderId: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addComment = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: number }) => {
      const { data, error } = await supabase
        .from("service_order_comments")
        .insert({
          service_order_id: serviceOrderId,
          content,
          parent_id: parentId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", serviceOrderId] });
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso!",
        variant: "default",
        className: "bg-green-500 text-white border-none",
      });
    },
  });

  const updateComment = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const { data, error } = await supabase
        .from("service_order_comments")
        .update({ content })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", serviceOrderId] });
      toast({
        title: "Comentário atualizado",
        description: "Seu comentário foi atualizado com sucesso!",
        variant: "default",
        className: "bg-blue-500 text-white border-none",
      });
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("service_order_comments")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", serviceOrderId] });
      toast({
        title: "Comentário removido",
        description: "Seu comentário foi removido com sucesso!",
        variant: "default",
        className: "bg-red-500 text-white border-none",
      });
    },
  });

  return {
    addComment,
    updateComment,
    deleteComment,
  };
};