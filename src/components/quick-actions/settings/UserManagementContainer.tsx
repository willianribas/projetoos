import React, { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, UserPlus, Key } from "lucide-react";

interface UserManagementContainerProps {
  onClose: () => void;
}

const AddUserDialog = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleAddUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (error) throw error;

      // Adicionar role padrão 'user' para o novo usuário
      if (user) {
        await supabase.from('user_roles').insert({
          user_id: user.id,
          role: 'user'
        });
      }

      toast({
        title: "Usuário criado com sucesso",
        description: `Um novo usuário foi criado com o email ${email}`,
      });

      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: error.message || "Não foi possível criar o usuário",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Adicionar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleAddUser} className="w-full">Criar Usuário</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ResetPasswordDialog = ({ user }: { user: User }) => {
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();

  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
      );

      if (error) throw error;

      toast({
        title: "Senha atualizada",
        description: "A senha foi atualizada com sucesso",
      });

      setNewPassword("");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar senha",
        description: error.message || "Não foi possível atualizar a senha",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Key className="h-4 w-4" />
          Redefinir Senha
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redefinir Senha</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleResetPassword} className="w-full">Atualizar Senha</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const UserManagementContainer = ({ onClose }: UserManagementContainerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const { data: { users }, error } = await supabase.auth.admin.listUsers();
        if (error) throw error;
        return users;
      } catch (error: any) {
        console.error("Error fetching users:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar usuários",
          description: error.message || "Não foi possível carregar a lista de usuários",
        });
        return [];
      }
    },
  });

  if (!user || user.email !== "williann.dev@gmail.com") {
    return null;
  }

  return (
    <Card className="fixed inset-4 z-50 overflow-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Gerenciamento de Usuários</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Lista de Usuários</h3>
          <AddUserDialog />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleString()
                      : "Nunca"}
                  </TableCell>
                  <TableCell>
                    <ResetPasswordDialog user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};