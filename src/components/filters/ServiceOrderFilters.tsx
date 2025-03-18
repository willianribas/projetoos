import { ServiceOrder } from "@/types";
import { statusOptions } from "@/components/ServiceOrderContent";

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

export const filterServiceOrders = ({
  serviceOrders,
  searchQuery,
  searchField,
  selectedStatus,
  searchCriteria = [],
}: ServiceOrderFiltersProps) => {
  return serviceOrders.filter((order) => {
    // Primeiro aplica os critérios de busca avançada
    const matchesCriteria = searchCriteria.length === 0 || searchCriteria.every(criteria => {
      const searchLower = criteria.value.toLowerCase().trim();
      
      // Função auxiliar para verificar se um campo contém o termo de busca
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

    // Se não passar nos critérios avançados, já retorna false
    if (!matchesCriteria) return false;

    // Depois aplica a busca simples si houver
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
  const statusOption = statusOptions.find(option => option.value === status);
  return statusOption?.color || "text-muted-foreground";
};
