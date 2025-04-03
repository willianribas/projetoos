
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
  StickyNote,
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
  onDeleteServiceOrder: (id: number) => void;
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  itemsPerPage?: number;
}

const ServiceOrderTable = ({
  serviceOrders,
  getStatusColor,
  statusOptions = [], // Provide default empty array
  onUpdateServiceOrder,
  onDeleteServiceOrder,
  selectedStatus,
  onStatusChange,
  itemsPerPage = 20, // Default to 20 if not provided
}: ServiceOrderTableProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{
    order: ServiceOrder;
    index: number;
  } | null>(null);
  const [editedOrder, setEditedOrder] = useState<ServiceOrder | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);

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

  const handleDelete = (e: React.MouseEvent, order: ServiceOrder) => {
    e.stopPropagation();
    console.log("Delete clicked for service order ID:", order.id, "Number:", order.numeroos);
    setDeleteOrderId(order.id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteOrderId !== null) {
      console.log("Confirming delete for service order ID:", deleteOrderId);
      onDeleteServiceOrder(deleteOrderId);
      setIsDeleteDialogOpen(false);
      setDeleteOrderId(null);
    }
  };

  return (
    <>
      <Card className="mt-8 border-muted bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg animate-fade-in">
        <CardHeader className="space-y-4">
          <CardTitle className="text-foreground font-bold flex items-center gap-2">
            <ActivitySquare className="h-5 w-5 text-primary" />
            Ordens de Serviço em Monitoramento
          </CardTitle>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-2 pb-4">
              <Badge
                variant={selectedStatus === null ? "default" : "outline"}
                className="cursor-pointer flex items-center gap-1 font-medium transition-colors duration-200 hover:bg-primary/90"
                onClick={() => onStatusChange(null)}
              >
                <Filter className="h-3 w-3" />
                Todos
              </Badge>
              {statusOptions && statusOptions.map((status) => {
                const Icon = status.icon;
                return (
                  <Badge
                    key={status.value}
                    variant={selectedStatus === status.value ? "default" : "outline"}
                    className={`cursor-pointer flex items-center gap-1 font-medium transition-colors duration-200 hover:bg-primary/90 ${
                      selectedStatus === status.value ? "bg-primary text-primary-foreground" : ""
                    }`}
                    onClick={() => onStatusChange(status.value)}
                  >
                    <Icon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[90px] text-center text-foreground/90 font-semibold whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <Hash className="h-4 w-4" />
                      <span className="hidden sm:inline">Número OS</span>
                      <span className="sm:hidden">Nº</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px] text-center text-foreground/90 font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Patrimônio</span>
                      <span className="sm:hidden">Pat.</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-[300px] text-center text-foreground/90 font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <Settings2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Equipamento</span>
                      <span className="sm:hidden">Equip.</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center text-foreground/90 font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <StickyNote className="h-4 w-4" />
                      <span className="hidden sm:inline">Observação</span>
                      <span className="sm:hidden">Obs.</span>
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
                      <span className="hidden sm:inline">Ações</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceOrders.map((order, index) => (
                  <ServiceOrderTableRow
                    key={order.id}
                    order={order}
                    index={index}
                    getStatusColor={getStatusColor}
                    onRowClick={handleRowClick}
                    onDelete={handleDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <EditServiceOrderDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        editedOrder={editedOrder}
        setEditedOrder={setEditedOrder}
        statusOptions={statusOptions || []} // Ensure we pass a fallback empty array
        onSave={handleSaveEdit}
      />

      <DeleteServiceOrderDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        serviceOrderId={deleteOrderId ?? undefined}
      />
    </>
  );
};

export default ServiceOrderTable;
