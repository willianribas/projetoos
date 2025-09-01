import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useClearAllServiceOrders } from "@/hooks/mutations/useClearAllServiceOrders";

export const ClearAllServiceOrders = () => {
  const clearAllServiceOrders = useClearAllServiceOrders();

  const handleClearAll = () => {
    clearAllServiceOrders.mutate();
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Limpar Todas as OSP</h4>
      <p className="text-xs text-muted-foreground mb-3">
        Remove permanentemente todas as suas Ordens de Serviço do sistema.
      </p>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            className="w-full"
            disabled={clearAllServiceOrders.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {clearAllServiceOrders.isPending ? "Limpando..." : "Limpar Todas as OSP"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Confirmar Limpeza Total</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                <strong>Esta ação é IRREVERSÍVEL!</strong>
              </p>
              <p>
                Todas as suas Ordens de Serviço serão permanentemente excluídas do banco de dados, incluindo:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Todas as OSP ativas</li>
                <li>Todas as OSP na lixeira</li>
                <li>Todo o histórico relacionado</li>
                <li>Todas as notificações relacionadas</li>
              </ul>
              <p className="font-semibold text-destructive mt-3">
                Tem certeza que deseja continuar?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearAll}
              className="bg-destructive hover:bg-destructive/90"
            >
              Sim, Excluir Tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};