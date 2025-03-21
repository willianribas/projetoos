
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
import { useAuth } from "./AuthProvider";
import { User } from "lucide-react";
import { useProfile } from "./profile/ProfileFetcher";
import { EditProfileDialog } from "./profile/EditProfileDialog";

export const UserProfile = () => {
  const { user, signOut, refreshUser } = useAuth();
  const { profile, isLoading, fetchProfile } = useProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);

  // When the edit dialog closes, refresh user data
  const handleEditDialogChange = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) {
      // Refresh both auth user and profile data
      refreshUser();
      fetchProfile();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2" aria-label="Carregando perfil">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
        <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative flex items-center gap-2"
            aria-label="Menu do usuário"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">
              Olá, {profile?.full_name || "Usuário"}
            </span>
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

      <EditProfileDialog
        open={isEditOpen}
        onOpenChange={handleEditDialogChange}
        user={user}
        initialFullName={profile?.full_name || ""}
      />
    </div>
  );
};
