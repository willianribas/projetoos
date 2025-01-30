import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProfileForm } from "./ProfileForm";
import { useProfileUpdate } from "@/hooks/useProfileUpdate";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  initialFullName: string;
}

export const EditProfileDialog = ({
  open,
  onOpenChange,
  user,
  initialFullName,
}: EditProfileDialogProps) => {
  const [fullName, setFullName] = useState(initialFullName);
  const [newPassword, setNewPassword] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { isUpdating, updateProfile } = useProfileUpdate();
  const { toast } = useToast();

  useEffect(() => {
    setFullName(initialFullName);
  }, [initialFullName]);

  useEffect(() => {
    const hasChanges = fullName !== initialFullName || newPassword !== "";
    setHasUnsavedChanges(hasChanges);
  }, [fullName, newPassword, initialFullName]);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm("Existem alterações não salvas. Deseja realmente fechar?");
      if (!confirmed) return;
    }
    onOpenChange(false);
    setNewPassword("");
    setFullName(initialFullName);
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await updateProfile(user.id, { full_name: fullName });

      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });
        
        if (passwordError) throw passwordError;
        
        toast({
          title: "Senha atualizada",
          description: "Sua senha foi alterada com sucesso.",
          className: "bg-green-500 text-white border-none",
        });
      }

      handleClose();
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar senha",
        description: error.message || "Não foi possível atualizar sua senha.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Atualize suas informações de perfil aqui. Todas as alterações serão salvas automaticamente.
          </DialogDescription>
        </DialogHeader>
        <ProfileForm
          fullName={fullName}
          email={user?.email}
          newPassword={newPassword}
          isLoading={isUpdating}
          onFullNameChange={setFullName}
          onPasswordChange={setNewPassword}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};