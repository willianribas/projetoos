import React, { useState } from 'react';
import { ServiceOrder } from '@/types';
import ServiceOrderTableRow from './ServiceOrderTableRow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ServiceOrderPagination from './pagination/ServiceOrderPagination';
import EditServiceOrderDialog from './EditServiceOrderDialog';
import DeleteServiceOrderDialog from './DeleteServiceOrderDialog';

interface ServiceOrderTableProps {
  serviceOrders: ServiceOrder[];
  onUpdateServiceOrder: (id: string, data: Partial<ServiceOrder>) => void;
  onDeleteServiceOrder: (id: string) => void;
}

const statusOptions = [
  { value: 'all', label: 'Todos', color: 'bg-gray-500' },
  { value: 'pending', label: 'Pendente', color: 'bg-amber-500' },
  { value: 'progress', label: 'Em andamento', color: 'bg-blue-500' },
  { value: 'completed', label: 'Concluído', color: 'bg-green-500' },
  { value: 'canceled', label: 'Cancelado', color: 'bg-red-500' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ade':
      return 'bg-ade';
    case 'ave':
      return 'bg-ave';
    case 'ext':
      return 'bg-ext';
    case 'pending':
      return 'bg-amber-500 hover:bg-amber-600 text-white';
    case 'progress':
      return 'bg-blue-500 hover:bg-blue-600 text-white';
    case 'completed':
      return 'bg-green-500 hover:bg-green-600 text-white';
    case 'canceled':
      return 'bg-red-500 hover:bg-red-600 text-white';
    case 'all':
      return 'bg-gray-500 hover:bg-gray-600 text-white';
    default:
      return '';
  }
};

const ServiceOrderTable = ({
  serviceOrders,
  onUpdateServiceOrder,
  onDeleteServiceOrder,
}: ServiceOrderTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<ServiceOrder | null>(null);

  const itemsPerPage = 10;

  // Filter by search term, status and type
  const filteredOrders = serviceOrders.filter((order) => {
    const matchesSearch =
      searchTerm === '' ||
      order.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.protocol.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesType = selectedType === 'all' || order.type === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleEditOrder = (order: ServiceOrder) => {
    setEditingOrder(order);
    setIsEditDialogOpen(true);
  };

  const handleDeleteOrder = (order: ServiceOrder) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const onStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const onTypeChange = (type: string) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por equipamento, cliente ou protocolo..."
            className="w-full sm:w-[300px] pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-2 mr-2">
            {statusOptions.map((status) => (
              <Badge
                key={status.value}
                variant={selectedStatus === status.value ? "default" : "outline"}
                className={`cursor-pointer flex items-center gap-1 font-medium transition-colors duration-200 ${
                  selectedStatus === status.value 
                    ? getStatusColor(status.value) 
                    : "hover:bg-primary/90"
                }`}
                onClick={() => onStatusChange(status.value)}
              >
                {status.label}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedType === 'all' ? "default" : "outline"}
              className={`cursor-pointer flex items-center gap-1 font-medium transition-colors duration-200 ${
                selectedType === 'all' 
                  ? "bg-gray-500 hover:bg-gray-600 text-white" 
                  : "hover:bg-primary/90"
              }`}
              onClick={() => onTypeChange('all')}
            >
              Todos
            </Badge>
            <Badge
              variant={selectedType === 'ade' ? "default" : "outline"}
              className={`cursor-pointer flex items-center gap-1 font-medium transition-colors duration-200 ${
                selectedType === 'ade' 
                  ? "bg-ade" 
                  : "hover:bg-primary/90"
              }`}
              onClick={() => onTypeChange('ade')}
            >
              ADE
            </Badge>
            <Badge
              variant={selectedType === 'ave' ? "default" : "outline"}
              className={`cursor-pointer flex items-center gap-1 font-medium transition-colors duration-200 ${
                selectedType === 'ave' 
                  ? "bg-ave" 
                  : "hover:bg-primary/90"
              }`}
              onClick={() => onTypeChange('ave')}
            >
              AVE
            </Badge>
            <Badge
              variant={selectedType === 'ext' ? "default" : "outline"}
              className={`cursor-pointer flex items-center gap-1 font-medium transition-colors duration-200 ${
                selectedType === 'ext' 
                  ? "bg-ext" 
                  : "hover:bg-primary/90"
              }`}
              onClick={() => onTypeChange('ext')}
            >
              EXT
            </Badge>
          </div>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Protocolo</TableHead>
              <TableHead>Equipamento</TableHead>
              <TableHead className="hidden md:table-cell">Cliente</TableHead>
              <TableHead className="hidden lg:table-cell">Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((serviceOrder) => (
                <ServiceOrderTableRow
                  key={serviceOrder.id}
                  serviceOrder={serviceOrder}
                  onEdit={handleEditOrder}
                  onDelete={handleDeleteOrder}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhuma ordem de serviço encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredOrders.length > itemsPerPage && (
        <ServiceOrderPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {editingOrder && (
        <EditServiceOrderDialog
          serviceOrder={editingOrder}
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onUpdateServiceOrder={onUpdateServiceOrder}
        />
      )}

      {orderToDelete && (
        <DeleteServiceOrderDialog
          serviceOrder={orderToDelete}
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onDeleteServiceOrder={onDeleteServiceOrder}
        />
      )}
    </div>
  );
};

export default ServiceOrderTable;
