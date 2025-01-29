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
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
}

const ServiceOrderTable = ({
  serviceOrders,
  getStatusColor,
  statusOptions,
  onUpdateServiceOrder,
  onDeleteServiceOrder,
  selectedStatus,
  onStatusChange,
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
      <Card className="mt-8 border-muted bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg animate-fade-in">
        <CardHeader className="space-y-4">
          <CardTitle className="text-foreground font-bold">Ordens de Serviço Registradas</CardTitle>
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
              {statusOptions.map((status) => {
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
                    {status.value}
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
                  <TableHead className="text-center text-foreground/90 font-semibold hidden md:table-cell">
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
                      <span className="hidden sm:inline">Ações</span>
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
          </div>
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