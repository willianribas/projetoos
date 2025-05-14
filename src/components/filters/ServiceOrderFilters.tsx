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

    // Depois aplica a busca simples se houver
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

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "ADE":
      return "text-blue-900 border-blue-900";
    case "AVT":
      return "text-orange-500 border-orange-500";
    case "EXT":
      return "text-purple-500 border-purple-500";
    case "A.M":
      return "text-red-500 border-red-500";
    case "INST":
      return "text-pink-500 border-pink-500";
    case "M.S":
      return "text-cyan-500 border-cyan-500";
    case "OSP":
      return "text-green-500 border-green-500";
    case "E.E":
      return "text-amber-500 border-amber-500";
    case "ADPD":
      return "text-fuchsia-500 border-fuchsia-500";
    default:
      return "text-gray-500 border-gray-500";
  }
};
