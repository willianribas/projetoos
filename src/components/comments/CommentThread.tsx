import { useState } from "react";
import { Comment } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentItem } from "./CommentItem";
import { useComments } from "@/hooks/queries/useComments";
import { useCommentMutations } from "@/hooks/mutations/useCommentMutations";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CommentThreadProps {
  serviceOrderId: number;
}

export const CommentThread = ({ serviceOrderId }: CommentThreadProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const { data: comments = [], isLoading } = useComments(serviceOrderId);
  const { addComment, updateComment, deleteComment } = useCommentMutations(serviceOrderId);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    await addComment.mutateAsync({
      content: newComment,
      parentId: replyingTo,
    });

    setNewComment("");
    setReplyingTo(null);
  };

  if (isLoading) {
    return <div>Carregando comentários...</div>;
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(commentId) => setReplyingTo(commentId)}
              onEdit={(commentId, content) => updateComment.mutate({ id: commentId, content })}
              onDelete={(commentId) => deleteComment.mutate(commentId)}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="space-y-2">
        {replyingTo && (
          <div className="flex items-center justify-between bg-muted p-2 rounded">
            <span className="text-sm">
              Respondendo ao comentário #{replyingTo}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
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