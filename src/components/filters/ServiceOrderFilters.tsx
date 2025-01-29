import { ServiceOrder } from "@/types";

interface SearchCriteria {
  field: string;
  value: string;
}

interface ServiceOrderFiltersProps {
  serviceOrders: ServiceOrder[];
  searchQuery: string;
  searchField: string;
  selectedStatus: string | null;
  searchCriteria: SearchCriteria[];
}

const statusColors: Record<string, string> = {
  'ADE': 'border-yellow-500 text-yellow-700 bg-yellow-50',
  'FINALIZADO': 'border-green-500 text-green-700 bg-green-50',
  'PENDENTE': 'border-red-500 text-red-700 bg-red-50',
  'EM ANDAMENTO': 'border-blue-500 text-blue-700 bg-blue-50',
};

export const filterServiceOrders = ({
  serviceOrders,
  searchQuery,
  searchField,
  selectedStatus,
  searchCriteria = [],
}: ServiceOrderFiltersProps) => {
  return serviceOrders.filter((order) => {
    const matchesCriteria = searchCriteria.length === 0 || searchCriteria.every(criteria => {
      const searchLower = criteria.value.toLowerCase().trim();
      const fieldContainsSearch = (field: string | null) => 
        (field?.toLowerCase() || "").includes(searchLower);

      return criteria.field === "all"
        ? (
            fieldContainsSearch(order.numeroos) ||
            fieldContainsSearch(order.patrimonio) ||
            fieldContainsSearch(order.equipamento) ||
            fieldContainsSearch(order.status) ||
            fieldContainsSearch(order.observacao)
          )
        : fieldContainsSearch(order[criteria.field as keyof ServiceOrder] as string | null);
    });

    if (!matchesCriteria) return false;

    const searchLower = searchQuery.toLowerCase().trim();
    
    if (!searchLower) {
      return selectedStatus ? order.status === selectedStatus : true;
    }

    const fieldContainsSearch = (field: string | null) => 
      (field?.toLowerCase() || "").includes(searchLower);

    const matchesSearch = searchField === "all" 
      ? (
          fieldContainsSearch(order.numeroos) ||
          fieldContainsSearch(order.patrimonio) ||
          fieldContainsSearch(order.equipamento) ||
          fieldContainsSearch(order.status) ||
          fieldContainsSearch(order.observacao)
        )
      : fieldContainsSearch(order[searchField as keyof ServiceOrder] as string | null);
    
    if (selectedStatus) {
      return matchesSearch && order.status === selectedStatus;
    }
    
    return matchesSearch;
  });
};

export const getStatusColor = (status: string) => {
  return statusColors[status] || 'border-gray-500 text-gray-700 bg-gray-50';
};