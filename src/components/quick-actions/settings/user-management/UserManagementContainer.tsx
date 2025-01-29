import React, { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { AddUserDialog } from "./AddUserDialog";
import { UsersList } from "./UsersList";

interface UserManagementContainerProps {
  onClose: () => void;
}

export const UserManagementContainer = ({ onClose }: UserManagementContainerProps) => {
  const { user } = useAuth();

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
        <UsersList />
      </CardContent>
    </Card>
  );
};