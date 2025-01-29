import { ServiceOrder } from "@/types";
import { ServiceOrderTable } from "@/components/ServiceOrderTable";
import { ServiceOrderPagination } from "@/components/pagination/ServiceOrderPagination";
import { getStatusColor } from "@/components/filters/ServiceOrderFilters";
import { statusOptions } from "../ServiceOrderContent";

interface ServiceOrderTableContainerProps {
  paginatedOrders: ServiceOrder[];
  handleUpdateServiceOrder: (index: number, updatedOrder: ServiceOrder) => void;
  handleDeleteServiceOrder: (index: number) => void;
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export const ServiceOrderTableContainer = ({
  paginatedOrders,
  handleUpdateServiceOrder,
  handleDeleteServiceOrder,
  selectedStatus,
  onStatusChange,
  currentPage,
  totalPages,
  setCurrentPage,
}: ServiceOrderTableContainerProps) => {
  return (
    <>
      <ServiceOrderTable 
        serviceOrders={paginatedOrders}
        getStatusColor={getStatusColor}
        statusOptions={statusOptions}
        onUpdateServiceOrder={handleUpdateServiceOrder}
        onDeleteServiceOrder={handleDeleteServiceOrder}
        selectedStatus={selectedStatus}
        onStatusChange={onStatusChange}
      />
      
      {totalPages > 1 && (
        <ServiceOrderPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};