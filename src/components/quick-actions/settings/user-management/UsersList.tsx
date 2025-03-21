import React, { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Key, Trash2, UserCog, Edit } from "lucide-react";

type AppRole = 'admin' | 'user';

const ChangePasswordDialog = ({ user }: { user: User }) => {
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleChangePassword = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: {
          action: 'update-password',
          userId: user.id,
          newPassword,
        }
      });

      if (error) throw error;

      toast({
        title: "Senha atualizada",
        description: "A senha foi atualizada com sucesso",
      });

      setNewPassword("");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar senha",
        description: error.message || "Não foi possível atualizar a senha",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mr-2">
          <Key className="h-4 w-4 mr-1" />
          Alterar Senha
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar Senha</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleChangePassword}>Atualizar Senha</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditUserDialog = ({ user, currentName }: { user: User; currentName: string }) => {
  const [fullName, setFullName] = useState(currentName || "");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleUpdateName = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Nome atualizado",
        description: "O nome foi atualizado com sucesso",
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error updating name:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar nome",
        description: error.message || "Não foi possível atualizar o nome",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mr-2">
          <Edit className="h-4 w-4 mr-1" />
          Editar Nome
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Nome</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdateName}>Atualizar Nome</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DeleteAccountDialog = ({ user, onDelete }: { user: User; onDelete: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase.functions.invoke('manage-users', {
        body: {
          action: 'delete',
          userId: user.id,
        }
      });

      if (error) throw error;

      toast({
        title: "Conta excluída",
        description: "A conta foi excluída com sucesso",
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpen(false);
      onDelete();
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir conta",
        description: error.message || "Não foi possível excluir a conta",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir Conta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Conta</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDeleteAccount}>Excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ChangeRoleDialog = ({ user, currentRole }: { user: User; currentRole: AppRole }) => {
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

export const UsersList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const { data: usersData, error: usersError } = await supabase.functions.invoke('manage-users', {
          body: { action: 'list' }
        });

        if (usersError) throw usersError;

        // Fetch profiles to get full names
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name');

        if (profilesError) throw profilesError;

        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');

        if (rolesError) throw rolesError;

        const usersWithDetails = usersData.users.map((user: User) => ({
          ...user,
          full_name: profilesData.find((p: any) => p.id === user.id)?.full_name || '',
          role: (rolesData.find((r: any) => r.user_id === user.id)?.role || 'user') as AppRole
        }));

        return usersWithDetails;
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
    enabled: !!user && user.email === "williann.dev@gmail.com",
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Último Login</TableHead>
          <TableHead>Permissão</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user: any) => (
          <TableRow key={user.id}>
            <TableCell>{user.full_name || 'Sem nome'}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {user.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString()
                : "Nunca"}
            </TableCell>
            <TableCell>
              {user.role === 'admin' ? 'Administrador' : 'Usuário'}
            </TableCell>
            <TableCell className="space-x-2">
              <EditUserDialog user={user} currentName={user.full_name} />
              <ChangePasswordDialog user={user} />
              <ChangeRoleDialog user={user} currentRole={user.role} />
              <DeleteAccountDialog user={user} onDelete={() => {}} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
