import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServiceOrder } from "@/types";
import ServiceOrderTableRow from "./ServiceOrderTableRow";
import EditServiceOrderDialog from "./EditServiceOrderDialog";
import DeleteServiceOrderDialog from "./DeleteServiceOrderDialog";
import { 
  Hash, 
  Building2, 
  Settings2, 
  ActivitySquare, 
  MessageSquare, 
  GripHorizontal,
} from "lucide-react";

interface ServiceOrderTableProps {
  serviceOrders: ServiceOrder[];
  getStatusColor: (status: string) => string;
  statusOptions: Array<{
    value: string;
    label: string;
    color: string;
    icon: any;
  }>;
  onUpdateServiceOrder: (index: number, updatedOrder: ServiceOrder) => void;
  onDeleteServiceOrder: (index: number) => void;
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
}

const ServiceOrderTable = ({
  serviceOrders,
  getStatusColor,
  statusOptions,
  onUpdateServiceOrder,
  onDeleteServiceOrder,
}: ServiceOrderTableProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{
    order: ServiceOrder;
    index: number;
  } | null>(null);
  const [editedOrder, setEditedOrder] = useState<ServiceOrder | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleRowClick = (order: ServiceOrder, index: number) => {
    setSelectedOrder({ order, index });
    setEditedOrder({ ...order });
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
          <CardTitle className="text-foreground font-bold">Ordens de Serviço Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[90px] text-center text-foreground/90 font-semibold whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <Hash className="h-4 w-4" />
                    Número OS
                  </div>
                </TableHead>
                <TableHead className="w-[100px] text-center text-foreground/90 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Patrimônio
                  </div>
                </TableHead>
                <TableHead className="w-[300px] text-center text-foreground/90 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Equipamento
                  </div>
                </TableHead>
                <TableHead className="text-center text-foreground/90 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Observação
                  </div>
                </TableHead>
                <TableHead className="w-[100px] text-center text-foreground/90 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <ActivitySquare className="h-4 w-4" />
                    Status
                  </div>
                </TableHead>
                <TableHead className="w-[70px] text-center text-foreground/90 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <GripHorizontal className="h-4 w-4" />
                    Ações
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceOrders.map((order, index) => (
                <ServiceOrderTableRow
                  key={index}
                  order={order}
                  index={index}
                  getStatusColor={getStatusColor}
                  onRowClick={handleRowClick}
                  onDelete={handleDelete}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditServiceOrderDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        editedOrder={editedOrder}
        setEditedOrder={setEditedOrder}
        statusOptions={statusOptions}
        onSave={handleSaveEdit}
      />

      <DeleteServiceOrderDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default ServiceOrderTable;