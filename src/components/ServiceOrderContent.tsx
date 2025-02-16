
import { useState } from "react";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/SearchBar";
import ServiceOrderForm from "@/components/ServiceOrderForm";
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
  AlertCircle,
  Clock4
} from "lucide-react";

export const statusOptions = [
  { 
    value: "ADE", 
    label: "Aguardando Decisão da Empresa", 
    color: "text-blue-500",
    icon: AlertCircle
  },
  { 
    value: "A.M", 
    label: "Aguardando Manutenção", 
    color: "text-red-500",
    icon: Clock4
  },
  { 
    value: "M.S", 
    label: "Manutenção Solicitada", 
    color: "#33C3F0",
    icon: Wrench
  },
];

interface SearchCriteria {
  field: string;
  value: string;
}

export default function ServiceOrderContent({ showTableByDefault = false }: { showTableByDefault?: boolean }) {
  const form = useForm<ServiceOrder>();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria[]>([]);
  const [showTable, setShowTable] = useState(showTableByDefault);
  const [showStats, setShowStats] = useState(false);
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
        onSubmit={onSubmit}
        statusOptions={statusOptions}
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
