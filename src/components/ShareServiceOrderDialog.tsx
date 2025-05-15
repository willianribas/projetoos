import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ServiceOrder } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ShareServiceOrderDialogProps {
  serviceOrder: ServiceOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Profile {
  id: string;
  full_name: string;
}

export function ShareServiceOrderDialog({ 
  serviceOrder, 
  isOpen, 
  onClose 
}: ShareServiceOrderDialogProps) {
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<Profile[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      try {
        // Fetch all users except the current one
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name")
          .neq("id", user.id);
        
        if (error) throw error;
        
        setAvailableUsers(data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Erro ao carregar usuários",
          description: "Não foi possível obter a lista de usuários.",
          variant: "destructive",
        });
      }
    };
    
    fetchUsers();
  }, [user]);

  const handleShare = async () => {
    if (!serviceOrder || !user || !recipientId) return;

    try {
      setIsLoading(true);

      // Clone the service order for the recipient
      const newServiceOrder = {
        numeroos: serviceOrder.numeroos,
        patrimonio: serviceOrder.patrimonio,
        equipamento: serviceOrder.equipamento,
        status: serviceOrder.status,
        priority: serviceOrder.priority,
        observacao: serviceOrder.observacao ? 
          `${serviceOrder.observacao}\n\n--- Compartilhado por ${user.email || 'outro usuário'} com mensagem: ${message || 'Nenhuma mensagem adicional.'}` : 
          `--- Compartilhado por ${user.email || 'outro usuário'} com mensagem: ${message || 'Nenhuma mensagem adicional.'}`,
        user_id: recipientId,
      };

      // Create a new service order directly for the recipient
      const { error: createError } = await supabase
        .from("service_orders")
        .insert([newServiceOrder]);

      if (createError) throw createError;
      
      // Keep a record of the share in shared_service_orders table
      const { error: shareError } = await supabase
        .from("shared_service_orders")
        .insert({
          service_order_id: serviceOrder.id,
          shared_by: user.id,
          shared_with: recipientId,
          message: message.trim() || null,
          is_accepted: true, // Auto-accept since we're skipping the approval process
        });

      if (shareError) console.error("Error recording share:", shareError);

      // Get recipient name for the toast message
      const selectedUser = availableUsers.find(u => u.id === recipientId);
      const recipientName = selectedUser?.full_name || recipientId;

      toast({
        title: "Ordem de serviço compartilhada",
        description: `A ordem de serviço foi enviada para ${recipientName} com sucesso!`,
        variant: "success",
      });

      // Close the dialog and reset form
      onClose();
      setMessage("");
      setRecipientId("");
      
    } catch (error: any) {
      console.error("Error sharing service order:", error);
      toast({
        title: "Erro ao compartilhar",
        description: error.message || "Não foi possível enviar a ordem de serviço.",
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
              Usuário
            </Label>
            <div className="col-span-3">
              <Select value={recipientId} onValueChange={setRecipientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.length > 0 ? (
                    availableUsers.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.full_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="loading">Carregando usuários...</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
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
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleShare} 
            disabled={isLoading || !recipientId}
            className="relative"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar OS"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
