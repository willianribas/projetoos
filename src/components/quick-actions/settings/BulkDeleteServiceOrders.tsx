import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useServiceOrdersQuery } from "@/hooks/queries/useServiceOrders";
import { usePermanentDeleteServiceOrder } from "@/hooks/mutations/usePermanentDeleteServiceOrder";
import { useToast } from "@/hooks/use-toast";
import { Trash2, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const statusOptions = [
  { value: "Aguardando", label: "Aguardando", color: "text-yellow-600" },
  { value: "Em andamento", label: "Em andamento", color: "text-blue-600" },
  { value: "Concluído", label: "Concluído", color: "text-green-600" },
  { value: "Cancelado", label: "Cancelado", color: "text-red-600" },
];

export const BulkDeleteServiceOrders = () => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { data: serviceOrders = [] } = useServiceOrdersQuery();
  const permanentDeleteMutation = usePermanentDeleteServiceOrder();
  const { toast } = useToast();

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const getOrdersToDelete = () => {
    return serviceOrders.filter(order => selectedStatuses.includes(order.status));
  };

  const handleBulkDelete = async () => {
    const ordersToDelete = getOrdersToDelete();
    
    try {
      for (const order of ordersToDelete) {
        await permanentDeleteMutation.mutateAsync(order.id);
      }
      
      toast({
        title: "Exclusão concluída",
        description: `${ordersToDelete.length} ordens de serviço foram excluídas permanentemente.`,
        variant: "default",
      });
      
      setSelectedStatuses([]);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Error during bulk delete:", error);
      toast({
        title: "Erro na exclusão",
        description: "Ocorreu um erro durante a exclusão em massa.",
        variant: "destructive",
      });
    }
  };

  const ordersToDelete = getOrdersToDelete();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Exclusão em Massa por Status
        </CardTitle>
        <CardDescription>
          Selecione os status das ordens de serviço que deseja excluir permanentemente do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Selecionar Status:</h4>
          {statusOptions.map((status) => {
            const count = serviceOrders.filter(order => order.status === status.value).length;
            return (
              <div key={status.value} className="flex items-center space-x-3">
                <Checkbox
                  id={status.value}
                  checked={selectedStatuses.includes(status.value)}
                  onCheckedChange={() => handleStatusToggle(status.value)}
                />
                <label
                  htmlFor={status.value}
                  className={`text-sm font-medium cursor-pointer ${status.color}`}
                >
                  {status.label} ({count} OS)
                </label>
              </div>
            );
          })}
        </div>

        {ordersToDelete.length > 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {ordersToDelete.length} ordem(ns) de serviço será(ão) excluída(s) permanentemente
              </span>
            </div>
          </div>
        )}

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              disabled={ordersToDelete.length === 0 || permanentDeleteMutation.isPending}
              className="w-full"
            >
              {permanentDeleteMutation.isPending ? "Excluindo..." : `Excluir ${ordersToDelete.length} OS`}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão Permanente</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação excluirá permanentemente {ordersToDelete.length} ordem(ns) de serviço com os status selecionados.
                <br /><br />
                <strong>Esta ação não pode ser desfeita!</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleBulkDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir Permanentemente
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};