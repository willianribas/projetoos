import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { ServiceOrder } from "@/types";

interface ServiceOrderTableProps {
  serviceOrders: ServiceOrder[];
  getStatusColor: (status: string) => string;
  statusOptions: Array<{
    value: string;
    label: string;
    color: string;
  }>;
  onUpdateServiceOrder: (index: number, updatedOrder: ServiceOrder) => void;
  onDeleteServiceOrder: (index: number) => void;
}

const ServiceOrderTable = ({ 
  serviceOrders, 
  getStatusColor, 
  statusOptions,
  onUpdateServiceOrder,
  onDeleteServiceOrder
}: ServiceOrderTableProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{order: ServiceOrder, index: number} | null>(null);
  const [editedOrder, setEditedOrder] = useState<ServiceOrder | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleRowClick = (order: ServiceOrder, index: number) => {
    setSelectedOrder({order, index});
    setEditedOrder({...order});
    setIsDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedOrder && editedOrder) {
      onUpdateServiceOrder(selectedOrder.index, editedOrder);
      setIsDialogOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setDeleteIndex(index);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      onDeleteServiceOrder(deleteIndex);
      setIsDeleteDialogOpen(false);
      setDeleteIndex(null);
    }
  };

  return (
    <>
      <Card className="mt-8 border-muted bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Ordens de Serviço Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número OS</TableHead>
                <TableHead>Patrimônio</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Observação</TableHead>
                <TableHead className="w-[50px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceOrders.map((order, index) => (
                <TableRow 
                  key={index}
                  className="cursor-pointer hover:bg-muted/60"
                  onClick={() => handleRowClick(order, index)}
                >
                  <TableCell>{order.numeroos}</TableCell>
                  <TableCell>{order.patrimonio}</TableCell>
                  <TableCell>{order.equipamento}</TableCell>
                  <TableCell>
                    <span className={`${getStatusColor(order.status)} border rounded px-2 py-1`} style={{ borderColor: 'currentColor' }}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.observacao}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-destructive/90 hover:text-destructive-foreground"
                      onClick={(e) => handleDelete(e, index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Ordem de Serviço</DialogTitle>
          </DialogHeader>
          {editedOrder && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label>Número OS</label>
                <Input
                  value={editedOrder.numeroos}
                  onChange={(e) => setEditedOrder({...editedOrder, numeroos: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label>Patrimônio</label>
                <Input
                  value={editedOrder.patrimonio}
                  onChange={(e) => setEditedOrder({...editedOrder, patrimonio: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label>Equipamento</label>
                <Input
                  value={editedOrder.equipamento}
                  onChange={(e) => setEditedOrder({...editedOrder, equipamento: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label>Status</label>
                <Select
                  value={editedOrder.status}
                  onValueChange={(value) => setEditedOrder({...editedOrder, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem 
                        key={status.value} 
                        value={status.value}
                        className={status.color}
                      >
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label>Observação</label>
                <Textarea
                  value={editedOrder.observacao || ''}
                  onChange={(e) => setEditedOrder({...editedOrder, observacao: e.target.value})}
                />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={handleSaveEdit}
              >
                Salvar Alterações
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta Ordem de Serviço? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ServiceOrderTable;