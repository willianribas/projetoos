import React from "react";
import { useAuth } from "@/components/AuthProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

export const UsersList = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-users`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'list'
          }),
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        
        return data.users;
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user: User) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {user.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString()
                : "Nunca"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};