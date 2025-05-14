
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ServiceOrder } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useServiceOrders } from "./ServiceOrderProvider";
import { Loader2, Search, Share2, UserPlus } from "lucide-react";

interface ShareServiceOrderDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  serviceOrder: ServiceOrder | null;
}

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthUser {
  id: string;
  email?: string | null;
}

const ShareServiceOrderDialog = ({
  isOpen,
  setIsOpen,
  serviceOrder,
}: ShareServiceOrderDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const { shareServiceOrder } = useServiceOrders();
  const { toast } = useToast();

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Buscar por email ou nome completo
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .ilike("full_name", `%${searchQuery}%`)
        .limit(5);

      if (error) throw error;

      // Também buscar por email na tabela auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) throw authError;

      // Typecasting to ensure we have the right structure
      const authUsers: AuthUser[] = authData?.users || [];

      // Combinar resultados
      const filteredUsers = authUsers
        .filter(authUser => 
          authUser.email?.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(authUser => {
          const profile = profiles?.find(p => p.id === authUser.id);
          return {
            id: authUser.id,
            email: authUser.email || '',
            full_name: profile?.full_name || '',
          };
        });

      setUsers(filteredUsers);
    } catch (error: any) {
      console.error("Erro ao buscar usuários:", error);
      toast({
        title: "Erro ao buscar usuários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleShare = async () => {
    if (!serviceOrder || !selectedUser) return;
    
    setIsLoading(true);
    try {
      shareServiceOrder(serviceOrder.id, selectedUser.id, message);
      setIsOpen(false);
      setMessage("");
      setSelectedUser(null);
      setSearchQuery("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setUsers([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchUsers();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" /> 
            Compartilhar Ordem de Serviço
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {serviceOrder && (
            <div className="rounded-md bg-muted p-3">
              <div className="font-medium">OS: {serviceOrder.numeroos}</div>
              <div className="text-sm text-muted-foreground">
                {serviceOrder.equipamento} | {serviceOrder.status}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Compartilhar com:</Label>
            <div className="relative">
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar por email ou nome"
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={searchUsers}
                  disabled={isSearching}
                >
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
              
              {users.length > 0 && (
                <div className="absolute w-full mt-1 border rounded-md bg-background shadow-lg z-10">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="p-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                      onClick={() => selectUser(user)}
                    >
                      <div>
                        <div>{user.full_name || 'Sem nome'}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                      <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {selectedUser && (
            <div className="rounded-md bg-muted p-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{selectedUser.full_name || 'Sem nome'}</div>
                <div className="text-xs text-muted-foreground">{selectedUser.email}</div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </Button>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Mensagem (opcional):</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Adicione uma mensagem sobre esta ordem de serviço"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleShare} 
            disabled={!selectedUser || isLoading}
            className="gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Compartilhar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareServiceOrderDialog;
