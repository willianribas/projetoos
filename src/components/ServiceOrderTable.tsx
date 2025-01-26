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