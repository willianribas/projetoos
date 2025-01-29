import React from "react";
import { useAuth } from "@/components/AuthProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ChangePasswordDialog } from "./dialogs/ChangePasswordDialog";
import { ChangeRoleDialog } from "./dialogs/ChangeRoleDialog";

type AppRole = 'admin' | 'user';

export const UsersList = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const { data: usersData, error: usersError } = await supabase.functions.invoke('manage-users', {
          body: { action: 'list' }
        });

        if (usersError) throw usersError;

        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');

        if (rolesError) throw rolesError;

        const usersWithRoles = usersData.users.map((user: any) => ({
          ...user,
          role: (rolesData.find((r: any) => r.user_id === user.id)?.role || 'user') as AppRole
        }));

        return usersWithRoles;
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
          <TableHead>Email</TableHead>
          <TableHead>Último Login</TableHead>
          <TableHead>Permissão</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user: any) => (
          <TableRow key={user.id}>
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
              <ChangePasswordDialog user={user} />
              <ChangeRoleDialog user={user} currentRole={user.role} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};