import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  user?: {
    profiles?: {
      full_name: string;
    }[];
  };
}

interface ServiceOrderCommentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  serviceOrderId: number;
}

export default function ServiceOrderCommentsDialog({
  isOpen,
  onClose,
  serviceOrderId,
}: ServiceOrderCommentsDialogProps) {
  const [comments, setComments] = React.useState<Comment[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<{ content: string }>();

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("service_order_comments")
      .select(`
        *,
        user:user_id (
          profiles (
            full_name
          )
        )
      `)
      .eq("service_order_id", serviceOrderId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }

    setComments(data || []);
  };

  React.useEffect(() => {
    if (isOpen && serviceOrderId) {
      fetchComments();
    }
  }, [isOpen, serviceOrderId]);

  const onSubmit = async (data: { content: string }) => {
    if (!user) return;

    const { error } = await supabase.from("service_order_comments").insert({
      service_order_id: serviceOrderId,
      user_id: user.id,
      content: data.content,
    });

    if (error) {
      toast({
        title: "Erro ao adicionar comentário",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Comentário adicionado",
      description: "Seu comentário foi adicionado com sucesso",
    });

    reset();
    fetchComments();
  };

  const handleDeleteComment = async (commentId: number) => {
    const { error } = await supabase
      .from("service_order_comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      toast({
        title: "Erro ao deletar comentário",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Comentário deletado",
      description: "Seu comentário foi deletado com sucesso",
    });

    fetchComments();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comentários
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-lg border bg-card/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {comment.user?.profiles?.[0]?.full_name || "Usuário"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(comment.created_at), "dd/MM/yyyy HH:mm")}
                    </span>
                  </div>
                  {user?.id === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 pt-4">
          <Textarea
            placeholder="Digite seu comentário..."
            className="min-h-[80px]"
            {...register("content", { required: true })}
          />
          <Button type="submit" size="icon" className="h-auto">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}