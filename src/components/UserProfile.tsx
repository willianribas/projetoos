import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import { ProfileForm } from "./profile/ProfileForm";
import { useProfile } from "./profile/ProfileFetcher";

export const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { profile, isLoading, fetchProfile } = useProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile?.full_name]);

  const handleDialogClose = () => {
    setIsEditOpen(false);
    setNewPassword("");
    if (profile) {
      setFullName(profile.full_name || "");
    }
  };

  const updateProfile = async () => {
    if (isUpdating || !user) return;
    
    try {
      setIsUpdating(true);

      const updates = {
        id: user.id,
        full_name: fullName,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (passwordError) throw passwordError;
      }

      // Atualiza o estado local antes de buscar novamente
      if (profile) {
        setProfile({ ...profile, full_name: fullName });
      }

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });

      handleDialogClose();
      
      // Aguarda um pouco antes de buscar o perfil novamente
      setTimeout(() => {
        fetchProfile();
      }, 1000);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro ao atualizar o perfil.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
        <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">Olá, {profile?.full_name || "Usuário"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            Editar Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut}>
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Atualize suas informações de perfil aqui.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            fullName={fullName}
            email={user?.email}
            newPassword={newPassword}
            isLoading={isUpdating}
            onFullNameChange={setFullName}
            onPasswordChange={setNewPassword}
            onSubmit={updateProfile}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};