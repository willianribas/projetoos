
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
  fullName: string;
  email: string | undefined;
  newEmail: string | undefined;
  newPassword: string;
  isLoading: boolean;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

export const ProfileForm = ({
  fullName,
  email,
  newEmail,
  newPassword,
  isLoading,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: ProfileFormProps) => {
  return (
    <form 
      className="space-y-4 py-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      aria-label="Formulário de edição de perfil"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          disabled={isLoading}
          aria-label="Nome completo"
          required
          minLength={2}
          maxLength={100}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={newEmail !== undefined ? newEmail : email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={isLoading}
          aria-label="Email do usuário"
          required
        />
        {newEmail !== undefined && newEmail !== email && (
          <p className="text-xs text-amber-600">
            Ao alterar seu email, você precisará verificá-lo novamente.
          </p>
        )}
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
          aria-label="Nova senha"
          minLength={6}
        />
      </div>
      <Button 
        type="submit"
        className="w-full"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Salvando...</span>
          </>
        ) : (
          "Salvar Alterações"
        )}
      </Button>
    </form>
  );
};
