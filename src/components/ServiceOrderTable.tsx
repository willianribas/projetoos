
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ServiceOrder } from "@/types";
import { ServiceOrderTableRow } from "./ServiceOrderTableRow";
import EditServiceOrderDialog from "./EditServiceOrderDialog";
import DeleteServiceOrderDialog from "./DeleteServiceOrderDialog";
import { Hash, Building2, Settings2, ActivitySquare, MessageSquare, GripHorizontal, Filter, StickyNote, CheckSquare, Edit, Trash, X, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useServiceOrders } from "./ServiceOrderProvider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

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
}

const ServiceOrderTable = ({
  serviceOrders,
  getStatusColor,
  statusOptions,
  onUpdateServiceOrder,
  onDeleteServiceOrder,
  selectedStatus,
  onStatusChange
}: ServiceOrderTableProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{
    order: ServiceOrder;
    index: number;
  } | null>(null);
  const [editedOrder, setEditedOrder] = useState<ServiceOrder | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);
  const [showBatchOperations, setShowBatchOperations] = useState(false);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [batchStatus, setBatchStatus] = useState<string>("");
  const [batchPriority, setBatchPriority] = useState<string>("");
  
  const { 
    selectedOrders, 
    toggleOrderSelection, 
    bulkUpdateServiceOrders,
    clearSelection 
  } = useServiceOrders();
  
  const handleRowClick = (order: ServiceOrder, index: number) => {
    // If batch mode is on, toggle selection instead of opening edit dialog
    if (showBatchOperations) {
      toggleOrderSelection(order.id);
      return;
    }
    
    setSelectedOrder({
      order,
      index
    });
    setEditedOrder({
      ...order
    });
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
  
  const isOrderSelected = (id: number) => selectedOrders.includes(id);
  
  const handleBatchAction = () => {
    setIsBatchDialogOpen(true);
  };
  
  const handleBatchUpdate = () => {
    const updates: Partial<ServiceOrder> = {};
    
    if (batchStatus) {
      updates.status = batchStatus;
    }
    
    if (batchPriority) {
      updates.priority = batchPriority;
    }
    
    if (Object.keys(updates).length === 0) {
      return;
    }
    
    bulkUpdateServiceOrders(updates);
    setIsBatchDialogOpen(false);
    setBatchStatus("");
    setBatchPriority("");
  };
  
  // Keyboard shortcuts for batch operations
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showBatchOperations) {
        // Escape key to exit batch mode
        if (event.key === 'Escape' && !isBatchDialogOpen) {
          setShowBatchOperations(false);
          clearSelection();
        }
        
        // Press A to select all
        if ((event.ctrlKey || event.metaKey) && event.key === 'a' && showBatchOperations) {
          event.preventDefault();
          serviceOrders.forEach(order => {
            if (!isOrderSelected(order.id)) {
              toggleOrderSelection(order.id);
            }
          });
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showBatchOperations, isBatchDialogOpen, serviceOrders, toggleOrderSelection, isOrderSelected, clearSelection]);

  return <>
      <Card className="mt-8 border-muted backdrop-blur-sm transition-all duration-300 hover:shadow-lg animate-fade-in bg-zinc-900">
        <CardHeader className="space-y-4 bg-zinc-900">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle className="text-foreground font-bold flex items-center gap-2">
              <ActivitySquare className="h-5 w-5 text-primary" />
              Ordens de Serviço em Monitoramento
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="batch-mode"
                  checked={showBatchOperations}
                  onCheckedChange={setShowBatchOperations}
                />
                <Label htmlFor="batch-mode">Modo lote</Label>
              </div>
              
              {showBatchOperations && selectedOrders.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBatchAction}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Editar {selectedOrders.length} item{selectedOrders.length !== 1 ? 's' : ''}</span>
                </Button>
              )}
              
              {showBatchOperations && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    clearSelection();
                    setShowBatchOperations(false);
                  }}
                  className="flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only">Cancelar</span>
                </Button>
              )}
            </div>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-2 pb-4">
              <Badge variant={selectedStatus === null ? "default" : "outline"} className="cursor-pointer flex items-center gap-1 font-medium transition-colors duration-200 hover:bg-primary/90" onClick={() => onStatusChange(null)}>
                <Filter className="h-3 w-3" />
                Todos
              </Badge>
              {statusOptions.map(status => {
              const Icon = status.icon;
              return <Badge key={status.value} variant={selectedStatus === status.value ? "default" : "outline"} className={`cursor-pointer flex items-center gap-1 font-medium transition-colors duration-200 ${selectedStatus === status.value ? getStatusColor(status.value) : "hover:bg-primary/90"}`} onClick={() => onStatusChange(status.value)}>
                    <Icon className="h-3 w-3" />
                    {status.value}
                  </Badge>;
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
                  {showBatchOperations && (
                    <TableHead className="w-[40px] text-center">
                      <div className="flex items-center justify-center">
                        <CheckSquare className="h-4 w-4" />
                      </div>
                    </TableHead>
                  )}
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
                    isSelected={showBatchOperations && isOrderSelected(order.id)}
                    onToggleSelect={() => toggleOrderSelection(order.id)}
                    batchMode={showBatchOperations}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {showBatchOperations && selectedOrders.length > 0 && (
          <CardFooter className="bg-muted/20 py-3 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {selectedOrders.length} {selectedOrders.length === 1 ? "ordem selecionada" : "ordens selecionadas"}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => clearSelection()}
              >
                <X className="mr-1 h-4 w-4" /> Limpar
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleBatchAction}
              >
                <Edit className="mr-1 h-4 w-4" /> Editar em lote
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <EditServiceOrderDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} editedOrder={editedOrder} setEditedOrder={setEditedOrder} statusOptions={statusOptions} onSave={handleSaveEdit} />

      <DeleteServiceOrderDialog isOpen={isDeleteDialogOpen} setIsOpen={setIsDeleteDialogOpen} onConfirm={confirmDelete} serviceOrderId={deleteOrderId ?? undefined} />
      
      {/* Batch Edit Dialog */}
      <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar {selectedOrders.length} Ordens de Serviço</DialogTitle>
            <DialogDescription>
              Atualize várias ordens de serviço de uma vez. Apenas os campos alterados serão atualizados.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="batch-status">Status</Label>
              <Select value={batchStatus} onValueChange={setBatchStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Não alterar</SelectItem>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="batch-priority">Prioridade</Label>
              <Select value={batchPriority} onValueChange={setBatchPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Não alterar</SelectItem>
                  <SelectItem value="1">Alta</SelectItem>
                  <SelectItem value="2">Média</SelectItem>
                  <SelectItem value="3">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsBatchDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleBatchUpdate} 
              disabled={!batchStatus && !batchPriority}
            >
              Atualizar {selectedOrders.length} {selectedOrders.length === 1 ? "ordem" : "ordens"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>;
};
export default ServiceOrderTable;
