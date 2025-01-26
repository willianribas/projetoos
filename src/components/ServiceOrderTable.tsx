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
import { useState } from "react";

interface ServiceOrder {
  numeroOS: string;
  patrimonio: string;
  equipamento: string;
  status: string;
  observacao: string;
}

interface ServiceOrderTableProps {
  serviceOrders: ServiceOrder[];
  getStatusColor: (status: string) => string;
  statusOptions: Array<{
    value: string;
    label: string;
    color: string;
  }>;
  onUpdateServiceOrder: (index: number, updatedOrder: ServiceOrder) => void;
}

const ServiceOrderTable = ({ 
  serviceOrders, 
  getStatusColor, 
  statusOptions,
  onUpdateServiceOrder 
}: ServiceOrderTableProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{order: ServiceOrder, index: number} | null>(null);
  const [editedOrder, setEditedOrder] = useState<ServiceOrder | null>(null);

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceOrders.map((order, index) => (
                <TableRow 
                  key={index}
                  className="cursor-pointer hover:bg-muted/60"
                  onClick={() => handleRowClick(order, index)}
                >
                  <TableCell>{order.numeroOS}</TableCell>
                  <TableCell>{order.patrimonio}</TableCell>
                  <TableCell>{order.equipamento}</TableCell>
                  <TableCell>
                    <span className={`${getStatusColor(order.status)} border rounded px-2 py-1`} style={{ borderColor: 'currentColor' }}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.observacao}</TableCell>
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
                  value={editedOrder.numeroOS}
                  onChange={(e) => setEditedOrder({...editedOrder, numeroOS: e.target.value})}
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
                  value={editedOrder.observacao}
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
    </>
  );
};

export default ServiceOrderTable;