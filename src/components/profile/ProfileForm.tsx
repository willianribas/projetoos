import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AvatarUpload } from "./AvatarUpload";

interface ProfileFormProps {
  fullName: string;
  email: string | undefined;
  newPassword: string;
  avatarUrl: string | null;
  previewUrl: string | null;
  isLoading: boolean;
  onFullNameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
}

export const ProfileForm = ({
  fullName,
  email,
  newPassword,
  avatarUrl,
  previewUrl,
  isLoading,
  onFullNameChange,
  onPasswordChange,
  onFileChange,
  onSubmit,
}: ProfileFormProps) => {
  return (
    <div className="space-y-4 py-4">
      <AvatarUpload
        avatarUrl={avatarUrl}
        previewUrl={previewUrl}
        onFileChange={onFileChange}
        isLoading={isLoading}
      />
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={email}
          disabled
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Nova Senha (opcional)</Label>
        <Input
          id="password"
          type="password"
          value={newPassword}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Digite para alterar a senha"
          disabled={isLoading}
        />
      </div>
      <Button 
        onClick={onSubmit} 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          "Salvar Alterações"
        )}
      </Button>
    </div>
  );
};