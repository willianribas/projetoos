import { useForm } from "react-hook-form";
import { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ServiceOrderForm from "@/components/ServiceOrderForm";
import QuickActions from "@/components/QuickActions";
import ServiceOrderTable from "@/components/ServiceOrderTable";
import Statistics from "@/components/Statistics";
import { useToast } from "@/hooks/use-toast";

interface ServiceOrder {
  numeroOS: string;
  patrimonio: string;
  equipamento: string;
  status: string;
  observacao: string;
}

const Index = () => {
  const form = useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();

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

  const onSubmit = (data: ServiceOrder) => {
    setServiceOrders([...serviceOrders, data]);
    form.reset();
    setIsOpen(false);
    toast({
      title: "Ordem de Serviço criada",
      description: "A OS foi registrada com sucesso!",
    });
  };

  const handleUpdateServiceOrder = (index: number, updatedOrder: ServiceOrder) => {
    const newOrders = [...serviceOrders];
    newOrders[index] = updatedOrder;
    setServiceOrders(newOrders);
    toast({
      title: "Ordem de Serviço atualizada",
      description: "As alterações foram salvas com sucesso!",
    });
  };

  const handleDeleteServiceOrder = (index: number) => {
    const newOrders = serviceOrders.filter((_, i) => i !== index);
    setServiceOrders(newOrders);
    toast({
      title: "Ordem de Serviço excluída",
      description: "A OS foi removida com sucesso!",
    });
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
