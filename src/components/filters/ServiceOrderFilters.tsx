import { ServiceOrder } from "@/types";
import { statusOptions } from "@/components/ServiceOrderContent";

interface ServiceOrderFiltersProps {
  serviceOrders: ServiceOrder[];
  searchQuery: string;
  selectedStatus: string | null;
}

export const filterServiceOrders = ({
  serviceOrders,
  searchQuery,
  selectedStatus,
}: ServiceOrderFiltersProps) => {
  return serviceOrders.filter((order) => {
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
};

export const getStatusColor = (status: string) => {
  const statusOption = statusOptions.find(option => option.value === status);
  return statusOption?.color || "text-muted-foreground";
};