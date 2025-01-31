import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Comment } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Reply, Trash2, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ServiceOrderCommentsProps {
  serviceOrderId: number;
}

export const ServiceOrderComments = ({ serviceOrderId }: ServiceOrderCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
    subscribeToComments();
  }, [serviceOrderId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("service_order_comments")
      .select("*")
      .eq("service_order_id", serviceOrderId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }

    setComments(data || []);
  };

  const subscribeToComments = () => {
    const channel = supabase
      .channel("comments-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "service_order_comments",
          filter: `service_order_id=eq.${serviceOrderId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setComments((prev) => [...prev, payload.new as Comment]);
          } else if (payload.eventType === "UPDATE") {
            setComments((prev) =>
              prev.map((comment) =>
                comment.id === payload.new.id ? (payload.new as Comment) : comment
              )
            );
          } else if (payload.eventType === "DELETE") {
            setComments((prev) =>
              prev.filter((comment) => comment.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    const { error } = await supabase.from("service_order_comments").insert({
      service_order_id: serviceOrderId,
      user_id: user?.id,
      content: newComment,
      parent_id: replyTo,
    });

    if (error) {
      toast({
        title: "Erro ao adicionar comentário",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return;
    }

    setNewComment("");
    setReplyTo(null);
  };

  const handleEdit = async (commentId: number) => {
    if (!editContent.trim()) return;

    const { error } = await supabase
      .from("service_order_comments")
      .update({ content: editContent })
      .eq("id", commentId);

    if (error) {
      toast({
        title: "Erro ao editar comentário",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return;
    }

    setEditingComment(null);
    setEditContent("");
  };

  const handleDelete = async (commentId: number) => {
    const { error } = await supabase
      .from("service_order_comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      toast({
        title: "Erro ao deletar comentário",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const renderComment = (comment: Comment) => (
    <div key={comment.id} className="flex gap-4 p-4 border-b last:border-0">
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {format(new Date(comment.created_at), "dd/MM/yyyy HH:mm", {
              locale: ptBR,
            })}
          </div>
          {user?.id === comment.user_id && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingComment(comment.id);
                  setEditContent(comment.content);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(comment.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {editingComment === comment.id ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingComment(null);
                  setEditContent("");
                }}
              >
                Cancelar
              </Button>
              <Button onClick={() => handleEdit(comment.id)}>Salvar</Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm">{comment.content}</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setReplyTo(comment.id)}
            >
              <Reply className="h-4 w-4 mr-1" />
              Responder
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[400px] border rounded-lg">
        <div className="divide-y">
          {comments.map((comment) => renderComment(comment))}
        </div>
      </ScrollArea>
      <div className="space-y-2">
        {replyTo && (
          <div className="flex items-center justify-between bg-muted p-2 rounded">
            <span className="text-sm">
              Respondendo ao comentário #{replyTo}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyTo(null)}
            >
              Cancelar
            </Button>
          </div>
        )}
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Adicione um comentário..."
          className="min-h-[100px]"
        />
        <Button onClick={handleSubmit} className="w-full">
          Enviar Comentário
        </Button>
      </div>
    </div>
  );
};