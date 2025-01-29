import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { UserCog } from "lucide-react";

type AppRole = 'admin' | 'user';

interface ChangeRoleDialogProps {
  user: User;
  currentRole: AppRole;
}

export const ChangeRoleDialog = ({ user, currentRole }: ChangeRoleDialogProps) => {
  const [role, setRole] = useState<AppRole>(currentRole);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleChangeRole = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Permissão atualizada",
        description: "A permissão do usuário foi atualizada com sucesso",
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar permissão",
        description: error.message || "Não foi possível atualizar a permissão",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mr-2">
          <UserCog className="h-4 w-4 mr-1" />
          Alterar Permissão
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar Permissão</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tipo de Permissão</Label>
            <Select value={role} onValueChange={(value: AppRole) => setRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleChangeRole}>Atualizar Permissão</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};