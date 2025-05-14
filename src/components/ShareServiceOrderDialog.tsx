
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ServiceOrder } from "@/types";

interface ShareServiceOrderDialogProps {
  serviceOrder: ServiceOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareServiceOrderDialog({ 
  serviceOrder, 
  isOpen, 
  onClose 
}: ShareServiceOrderDialogProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleShare = async () => {
    if (!serviceOrder || !user || !recipientEmail.trim()) return;

    try {
      setIsLoading(true);

      // First check if recipient user exists
      const { data: recipientUser, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", recipientEmail.trim())
        .single();

      if (userError || !recipientUser) {
        toast({
          title: "Usuário não encontrado",
          description: "O email informado não corresponde a nenhum usuário cadastrado.",
          variant: "destructive",
        });
        return;
      }

      // Create shared service order
      const { error: shareError } = await supabase
        .from("shared_service_orders")
        .insert({
          service_order_id: serviceOrder.id,
          shared_by: user.id,
          shared_with: recipientUser.id,
          message: message.trim() || null,
        });

      if (shareError) throw shareError;

      // Create notification for recipient
      const { error: notificationError } = await supabase
        .from("notification_states")
        .insert({
          user_id: recipientUser.id,
          service_order_id: serviceOrder.id,
          notification_type: "shared_service_order",
        });

      if (notificationError) throw notificationError;

      // Soft delete from sender's orders (set deleted_at)
      const { error: deleteError } = await supabase
        .from("service_orders")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", serviceOrder.id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      toast({
        title: "Ordem de serviço compartilhada",
        description: `A ordem de serviço foi enviada para ${recipientEmail}`,
        variant: "success",
      });

      onClose();
    } catch (error: any) {
      console.error("Error sharing service order:", error);
      toast({
        title: "Erro ao compartilhar",
        description: "Não foi possível enviar a ordem de serviço.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Compartilhar Ordem de Serviço</DialogTitle>
          <DialogDescription>
            Envie esta ordem de serviço (OS #{serviceOrder?.numeroos}) para outro usuário.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recipient" className="text-right">
              Email
            </Label>
            <Input
              id="recipient"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="col-span-3"
              placeholder="email@example.com"
              type="email"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Mensagem
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3"
              placeholder="Mensagem opcional para o destinatário"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleShare} disabled={isLoading || !recipientEmail.trim()}>
            {isLoading ? "Enviando..." : "Enviar OS"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
