
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  // Cleanup function for resize observer
  useEffect(() => {
    const cleanup = () => {
      const observers = (window as any).__resizeObservers || [];
      observers.forEach((observer: any) => {
        observer.disconnect();
      });
    };

    return cleanup;
  }, []);

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
          <CardTitle className="text-foreground font-bold flex items-center gap-2">
            <ActivitySquare className="h-5 w-5 text-primary" />
            Ordens de Serviço em Monitoramento
          </CardTitle>
          <ScrollArea className="w-full whitespace-nowrap py-2">
            <div className="flex space-x-2 pb-2">
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
          </ScrollArea>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full overflow-auto rounded-md border">
            <div className="min-w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[90px] text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Hash className="h-4 w-4" />
                        <span className="hidden sm:inline">Número OS</span>
                        <span className="sm:hidden">Nº</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px] text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Patrimônio</span>
                        <span className="sm:hidden">Pat.</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[300px] text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Settings2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Equipamento</span>
                        <span className="sm:hidden">Equip.</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <StickyNote className="h-4 w-4" />
                        <span className="hidden sm:inline">Observação</span>
                        <span className="sm:hidden">Obs.</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px] text-center">
                      <div className="flex items-center justify-center gap-2">
                        <ActivitySquare className="h-4 w-4" />
                        Status
                      </div>
                    </TableHead>
                    <TableHead className="w-[70px] text-center">
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
                      statusArray={order.status_array}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
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
