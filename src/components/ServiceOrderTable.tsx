import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
  Filter,
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
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

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
        <CardHeader className="space-y-4">
          <CardTitle>Ordens de Serviço Registradas</CardTitle>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-2 pb-4">
              <Badge
                variant={selectedStatus === null ? "default" : "outline"}
                className="cursor-pointer flex items-center gap-1"
                onClick={() => setSelectedStatus(null)}
              >
                <Filter className="h-3 w-3" />
                Todos
              </Badge>
              {statusOptions.map((status) => {
                const Icon = status.icon;
                return (
                  <Badge
                    key={status.value}
                    variant={selectedStatus === status.value ? "default" : "outline"}
                    className={`cursor-pointer flex items-center gap-1 ${selectedStatus === status.value ? "bg-primary" : ""}`}
                    onClick={() => setSelectedStatus(status.value)}
                  >
                    <Icon className="h-3 w-3" />
                    {status.value}
                  </Badge>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Número OS
                  </div>
                </TableHead>
                <TableHead className="w-[120px]">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Patrimônio
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Equipamento
                  </div>
                </TableHead>
                <TableHead className="-ml-24">
                  <div className="flex items-center">
                    <ActivitySquare className="h-4 w-4 mr-1" />
                    Status
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Observação
                  </div>
                </TableHead>
                <TableHead className="w-[50px]">
                  <div className="flex items-center gap-2">
                    <GripHorizontal className="h-4 w-4" />
                    Ações
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceOrders
                .filter(order => selectedStatus ? order.status === selectedStatus : true)
                .map((order, index) => (
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
