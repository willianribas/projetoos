import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ServiceOrderForm from "@/components/ServiceOrderForm";
import QuickActions from "@/components/QuickActions";
import ServiceOrderTable from "@/components/ServiceOrderTable";
import Statistics from "@/components/Statistics";
import ADEMonitor from "@/components/ADEMonitor";
import { useToast } from "@/hooks/use-toast";
import { ServiceOrder } from "@/types";
import { getServiceOrders, createServiceOrder, updateServiceOrder, deleteServiceOrder } from "@/lib/supabase";

const Index = () => {
  const form = useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch service orders
  const { data: serviceOrders = [] } = useQuery({
    queryKey: ['serviceOrders'],
    queryFn: getServiceOrders,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createServiceOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceOrders'] });
      toast({
        title: "Ordem de Serviço criada",
        description: "A OS foi registrada com sucesso!",
      });
      form.reset();
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar OS",
        description: "Ocorreu um erro ao criar a ordem de serviço.",
        variant: "destructive",
      });
      console.error('Error creating service order:', error);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ServiceOrder> }) => 
      updateServiceOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceOrders'] });
      toast({
        title: "Ordem de Serviço atualizada",
        description: "As alterações foram salvas com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar OS",
        description: "Ocorreu um erro ao atualizar a ordem de serviço.",
        variant: "destructive",
      });
      console.error('Error updating service order:', error);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteServiceOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceOrders'] });
      toast({
        title: "Ordem de Serviço excluída",
        description: "A OS foi removida com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir OS",
        description: "Ocorreu um erro ao excluir a ordem de serviço.",
        variant: "destructive",
      });
      console.error('Error deleting service order:', error);
    },
  });

  const statusOptions = [
    { value: "ADE", label: "ADE - Aguardando Disponibilidade", color: "text-blue-900" },
    { value: "AVT", label: "AVT - Aguardando vinda técnica", color: "text-[#F97316]" },
    { value: "EXT", label: "EXT - Serviço Externo", color: "text-[#9b87f5]" },
    { value: "A.M", label: "A.M - Aquisição de Material", color: "text-[#ea384c]" },
    { value: "INST", label: "INST - Instalação", color: "text-pink-500" },
    { value: "M.S", label: "M.S - Material Solicitado", color: "text-[#33C3F0]" },
    { value: "OSP", label: "OSP - Ordem de Serviço Pronta", color: "text-[#22c55e]" },
    { value: "E.E", label: "E.E - Em Execução", color: "text-[#F97316]" }
  ];

  const onSubmit = (data: Omit<ServiceOrder, 'id'>) => {
    createMutation.mutate(data);
  };

  const handleUpdateServiceOrder = (id: number, updatedOrder: Partial<ServiceOrder>) => {
    updateMutation.mutate({ id, data: updatedOrder });
  };

  const handleDeleteServiceOrder = (id: number) => {
    deleteMutation.mutate(id);
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || "text-muted-foreground";
  };

  const filteredOrders = serviceOrders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (order.numeroOS?.toLowerCase() || "").includes(searchLower) ||
      (order.patrimonio?.toLowerCase() || "").includes(searchLower) ||
      (order.equipamento?.toLowerCase() || "").includes(searchLower) ||
      (order.status?.toLowerCase() || "").includes(searchLower) ||
      (order.observacao?.toLowerCase() || "").includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <Header />
      <ADEMonitor serviceOrders={serviceOrders} />
      <ServiceOrderForm 
        form={form}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={onSubmit}
        statusOptions={statusOptions}
      />
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-4">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <QuickActions 
            setShowTable={setShowTable} 
            showTable={showTable}
            setShowStats={setShowStats}
            showStats={showStats}
            serviceOrders={serviceOrders}
          />
          {(showTable || searchQuery) && (
            <ServiceOrderTable 
              serviceOrders={filteredOrders}
              getStatusColor={getStatusColor}
              statusOptions={statusOptions}
              onUpdateServiceOrder={handleUpdateServiceOrder}
              onDeleteServiceOrder={handleDeleteServiceOrder}
            />
          )}
          {showStats && (
            <Statistics 
              serviceOrders={serviceOrders}
              statusOptions={statusOptions}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;