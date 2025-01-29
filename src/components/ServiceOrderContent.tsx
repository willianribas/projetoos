import { useState } from "react";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/SearchBar";
import ServiceOrderForm from "@/components/ServiceOrderForm";
import QuickActions from "@/components/QuickActions";
import ServiceOrderTable from "@/components/ServiceOrderTable";
import Statistics from "@/components/Statistics";
import { useServiceOrders } from "./ServiceOrderProvider";
import { ServiceOrder } from "@/types";
import ServiceOrderPagination from "./pagination/ServiceOrderPagination";
import { filterServiceOrders, getStatusColor } from "./filters/ServiceOrderFilters";
import { 
  Clock, 
  CalendarClock, 
  Building2, 
  ShoppingCart, 
  Wrench, 
  Package, 
  CheckCircle2, 
  Hammer,
  Maximize,
  Minimize,
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

interface SearchCriteria {
  field: string;
  value: string;
}

export default function ServiceOrderContent() {
  const form = useForm<ServiceOrder>();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const itemsPerPage = 10;
  
  const { serviceOrders, createServiceOrder, updateServiceOrder, deleteServiceOrder } = useServiceOrders();

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSearchFieldChange = (field: string) => {
    setSearchField(field);
    setCurrentPage(1);
  };

  const handleSearchCriteriaChange = (criteria: SearchCriteria[]) => {
    setSearchCriteria(criteria);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string | null) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const onSubmit = (data: Omit<ServiceOrder, "id" | "created_at">) => {
    createServiceOrder(data);
    form.reset();
    setIsOpen(false);
    // Após criar a OS, exibe automaticamente a tabela
    setShowTable(true);
    setShowStats(false);
  };

  const handleUpdateServiceOrder = (index: number, updatedOrder: ServiceOrder) => {
    const order = serviceOrders[index];
    if (order) {
      updateServiceOrder(order.id, updatedOrder);
    }
  };

  const handleDeleteServiceOrder = (index: number) => {
    const order = serviceOrders[index];
    if (order) {
      deleteServiceOrder(order.id);
    }
  };

  const filteredOrders = filterServiceOrders({
    serviceOrders,
    searchQuery,
    searchField,
    selectedStatus,
    searchCriteria,
  });

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
      <QuickActions 
        setShowTable={setShowTable} 
        showTable={showTable}
        setShowStats={setShowStats}
        showStats={showStats}
        serviceOrders={serviceOrders}
      />
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={handleSearchQueryChange}
        searchField={searchField}
        setSearchField={handleSearchFieldChange}
        searchCriteria={searchCriteria}
        setSearchCriteria={handleSearchCriteriaChange}
      />

      {(showTable || searchQuery || searchCriteria.length > 0) && (
        <div className="space-y-4 overflow-x-auto pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Ordens de Serviço Registradas</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTable(!showTable)}
              className="animate-fade-in"
            >
              {showTable ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <ServiceOrderTable 
            serviceOrders={paginatedOrders}
            getStatusColor={getStatusColor}
            statusOptions={statusOptions}
            onUpdateServiceOrder={handleUpdateServiceOrder}
            onDeleteServiceOrder={handleDeleteServiceOrder}
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
          />
          
          {totalPages > 1 && (
            <ServiceOrderPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
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
