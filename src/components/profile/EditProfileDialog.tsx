
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProfileForm } from "./ProfileForm";
import { useProfileUpdate } from "@/hooks/useProfileUpdate";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";

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
  const [newEmail, setNewEmail] = useState<string | undefined>(undefined);
  const [newPassword, setNewPassword] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { isUpdating, updateProfile } = useProfileUpdate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  useEffect(() => {
    setFullName(initialFullName);
  }, [initialFullName]);

  useEffect(() => {
    const hasEmailChanged = newEmail !== undefined && newEmail !== user?.email;
    const hasNameChanged = fullName !== initialFullName;
    const hasPasswordChanged = newPassword !== "";
    
    setHasUnsavedChanges(hasEmailChanged || hasNameChanged || hasPasswordChanged);
  }, [fullName, newEmail, newPassword, initialFullName, user?.email]);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm("Existem alterações não salvas. Deseja realmente fechar?");
      if (!confirmed) return;
    }
    onOpenChange(false);
    setNewPassword("");
    setNewEmail(undefined);
    setFullName(initialFullName);
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await updateProfile(user.id, { full_name: fullName });

      const updatePromises = [];

      // Update email if changed
      if (newEmail && newEmail !== user.email) {
        const emailPromise = supabase.functions.invoke('manage-users', {
          body: {
            action: 'update-email',
            userId: user.id,
            newEmail: newEmail,
          }
        }).then(({ error }) => {
          if (error) throw error;
          
          toast({
            title: "Email atualizado",
            description: "Seu email foi atualizado com sucesso.",
            className: "bg-blue-500 text-white border-none",
          });
          
          // Refresh user data after email update
          refreshUser();
          
          // Invalidate users query to refresh user management data
          queryClient.invalidateQueries({ queryKey: ["users"] });
        });
        
        updatePromises.push(emailPromise);
      }

      // Update password if changed
      if (newPassword) {
        const passwordPromise = supabase.auth.updateUser({
          password: newPassword,
        }).then(({ error }) => {
          if (error) throw error;
          
          toast({
            title: "Senha atualizada",
            description: "Sua senha foi alterada com sucesso.",
            className: "bg-green-500 text-white border-none",
          });
        });
        
        updatePromises.push(passwordPromise);
      }

      // Wait for all updates to complete
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }

      handleClose();
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar informações",
        description: error.message || "Não foi possível atualizar suas informações.",
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
          newEmail={newEmail}
          newPassword={newPassword}
          isLoading={isUpdating}
          onFullNameChange={setFullName}
          onEmailChange={setNewEmail}
          onPasswordChange={setNewPassword}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
