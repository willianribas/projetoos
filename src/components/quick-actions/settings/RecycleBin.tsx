
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, RotateCcw, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeletedServiceOrdersQuery } from "@/hooks/queries/useDeletedServiceOrders";
import { useRestoreServiceOrder } from "@/hooks/mutations/useRestoreServiceOrder";
import { usePermanentDeleteServiceOrder } from "@/hooks/mutations/usePermanentDeleteServiceOrder";
import { format } from "date-fns";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { ServiceOrder } from "@/types";

export const RecycleBin = () => {
  const { data: deletedOrders = [], isLoading } = useDeletedServiceOrdersQuery();
  const restoreMutation = useRestoreServiceOrder();
  const permanentDeleteMutation = usePermanentDeleteServiceOrder();
  const [orderToDelete, setOrderToDelete] = useState<ServiceOrder | null>(null);
  
  const handleRestore = (id: number) => {
    restoreMutation.mutate(id);
  };
  
  const handlePermanentDelete = () => {
    if (orderToDelete) {
      permanentDeleteMutation.mutate(orderToDelete.id);
      setOrderToDelete(null);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ADE":
        return "text-blue-900";
      case "AVT":
        return "text-[#F97316]";
      case "EXT":
        return "text-[#9b87f5]";
      case "A.M":
        return "text-[#ea384c]";
      case "INST":
        return "text-pink-500";
      case "M.S":
        return "text-[#33C3F0]";
      case "OSP":
        return "text-[#22c55e]";
      case "E.E":
        return "text-[#F97316]";
      default:
        return "text-foreground";
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-muted-foreground" />
          Lixeira
          <Badge variant="outline" className="ml-2 text-yellow-600 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400">
            Auto-excluir em 3 dias
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">Carregando...</div>
        ) : deletedOrders.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lixeira vazia</AlertTitle>
            <AlertDescription>
              Não há ordens de serviço na lixeira.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert className="mb-4 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                As ordens de serviço excluídas permanecem aqui por 3 dias e depois são excluídas permanentemente. Restaure-as se quiser mantê-las.
              </AlertDescription>
            </Alert>
            
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Número OS</TableHead>
                    <TableHead className="w-[100px]">Patrimônio</TableHead>
                    <TableHead>Equipamento</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[150px]">Excluído em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.numeroos}</TableCell>
                      <TableCell>{order.patrimonio}</TableCell>
                      <TableCell>{order.equipamento}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.deleted_at ? format(new Date(order.deleted_at), 'dd/MM/yyyy HH:mm') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950"
                            onClick={() => handleRestore(order.id)}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Restaurar
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                                onClick={() => setOrderToDelete(order)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir permanentemente</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Isso excluirá permanentemente a Ordem de Serviço {order.numeroos} e removerá todos os dados associados a ela.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  onClick={handlePermanentDelete}
                                >
                                  Excluir permanentemente
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
};
