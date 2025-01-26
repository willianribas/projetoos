import { useState } from "react";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/SearchBar";
import ServiceOrderForm from "@/components/ServiceOrderForm";
import QuickActions from "@/components/QuickActions";
import ServiceOrderTable from "@/components/ServiceOrderTable";
import Statistics from "@/components/Statistics";
import { useServiceOrders } from "./ServiceOrderProvider";
import { ServiceOrder } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Filter, 
  Clock, 
  CalendarClock, 
  Building2, 
  ShoppingCart, 
  Wrench, 
  Package, 
  CheckCircle2, 
  Hammer 
} from "lucide-react";

export const statusOptions = [
  { value: "ADE", label: "ADE - Aguardando Disponibilidade", color: "text-blue-900", icon: Clock },
  { value: "AVT", label: "AVT - Aguardando vinda técnica", color: "text-[#F97316]", icon: CalendarClock },
  { value: "EXT", label: "EXT - Serviço Externo", color: "text-[#9b87f5]", icon: Building2 },
  { value: "A.M", label: "A.M - Aquisição de Material", color: "text-[#ea384c]", icon: ShoppingCart },
  { value: "INST", label: "INST - Instalação", color: "text-pink-500", icon: Wrench },
  { value: "M.S", label: "M.S - Material Solicitado", color: "text-[#33C3F0]", icon: Package },
  { value: "OSP", label: "OSP - Ordem de Serviço Pronta", color: "text-[#22c55e]", icon: CheckCircle2 },
  { value: "E.E", label: "E.E - Em Execução", color: "text-[#F97316]", icon: Hammer }
];

export default function ServiceOrderContent() {
  const form = useForm<ServiceOrder>();
  const [searchQuery, setSearchQuery] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Changed to false to start minimized
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const itemsPerPage = 10;
  
  const { serviceOrders, createServiceOrder, updateServiceOrder, deleteServiceOrder } = useServiceOrders();

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || "text-muted-foreground";
  };

  const onSubmit = (data: Omit<ServiceOrder, "id" | "created_at">) => {
    createServiceOrder(data);
    form.reset();
    setIsOpen(false);
  };

  const filteredOrders = serviceOrders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      (order.numeroos?.toLowerCase() || "").includes(searchLower) ||
      (order.patrimonio?.toLowerCase() || "").includes(searchLower) ||
      (order.equipamento?.toLowerCase() || "").includes(searchLower) ||
      (order.status?.toLowerCase() || "").includes(searchLower) ||
      (order.observacao?.toLowerCase() || "").includes(searchLower)
    );
    
    if (selectedStatus) {
      return matchesSearch && order.status === selectedStatus;
    }
    
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      <ServiceOrderForm 
        form={form}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={onSubmit}
        statusOptions={statusOptions}
      />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <QuickActions 
        setShowTable={setShowTable} 
        showTable={showTable}
        setShowStats={setShowStats}
        showStats={showStats}
        serviceOrders={serviceOrders}
      />

      {/* Status Filter */}
      {(showTable || searchQuery) && (
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
      )}

      {(showTable || searchQuery) && (
        <>
          <ServiceOrderTable 
            serviceOrders={paginatedOrders}
            getStatusColor={getStatusColor}
            statusOptions={statusOptions}
            onUpdateServiceOrder={(index, updatedOrder) => {
              const order = serviceOrders[index];
              if (order) {
                updateServiceOrder(order.id, updatedOrder);
              }
            }}
            onDeleteServiceOrder={(index) => {
              const order = serviceOrders[index];
              if (order) {
                deleteServiceOrder(order.id);
              }
            }}
          />
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md bg-primary/10 hover:bg-primary/20 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-3 py-2">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md bg-primary/10 hover:bg-primary/20 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}

      {showStats && (
        <Statistics 
          serviceOrders={serviceOrders}
          statusOptions={statusOptions}
        />
      )}
    </div>
  );
}
