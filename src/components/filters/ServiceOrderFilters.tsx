import { ServiceOrder } from "@/types";
import { statusOptions } from "@/components/ServiceOrderContent";

interface ServiceOrderFiltersProps {
  serviceOrders: ServiceOrder[];
  searchQuery: string;
  searchField: string;
  selectedStatus: string | null;
}

export const filterServiceOrders = ({
  serviceOrders,
  searchQuery,
  searchField,
  selectedStatus,
}: ServiceOrderFiltersProps) => {
  return serviceOrders.filter((order) => {
    const searchLower = searchQuery.toLowerCase().trim();
    
    // Se não houver termo de busca, apenas filtra por status
    if (!searchLower) {
      return selectedStatus ? order.status === selectedStatus : true;
    }

    // Função auxiliar para verificar se um campo contém o termo de busca
    const fieldContainsSearch = (field: string | null) => 
      (field?.toLowerCase() || "").includes(searchLower);

    // Busca em todos os campos ou no campo específico selecionado
    const matchesSearch = searchField === "all" 
      ? (
          fieldContainsSearch(order.numeroos) ||
          fieldContainsSearch(order.patrimonio) ||
          fieldContainsSearch(order.equipamento) ||
          fieldContainsSearch(order.status) ||
          fieldContainsSearch(order.observacao)
        )
      : fieldContainsSearch(order[searchField as keyof ServiceOrder] as string | null);
    
    // Aplica o filtro de status se estiver selecionado
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