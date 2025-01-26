import { useForm } from "react-hook-form";
import { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ServiceOrderForm from "@/components/ServiceOrderForm";
import QuickActions from "@/components/QuickActions";
import ServiceOrderTable from "@/components/ServiceOrderTable";

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
  const [isOpen, setIsOpen] = useState(true);

  const statusOptions = [
    { value: "ADE", label: "ADE - Aguardando Disponibilidade", color: "text-[#221F26]" },
    { value: "AVT", label: "AVT - Aguardando vinda técnica", color: "text-[#F97316]" },
    { value: "EXT", label: "EXT - Serviço Externo", color: "text-[#9b87f5]" },
    { value: "A.M", label: "A.M - Aquisição de Material", color: "text-[#ea384c]" },
    { value: "INST", label: "INST - Instalação", color: "text-muted-foreground" },
    { value: "M.S", label: "M.S - Material Solicitado", color: "text-[#33C3F0]" },
    { value: "OSP", label: "OSP - Ordem de Serviço Pronta", color: "text-[#22c55e]" },
    { value: "E.E", label: "E.E - Em Execução", color: "text-[#F97316]" }
  ];

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || "text-muted-foreground";
  };

  const onSubmit = (data: any) => {
    setServiceOrders([...serviceOrders, data]);
    form.reset();
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
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <QuickActions setShowTable={setShowTable} showTable={showTable} />
      {(showTable || searchQuery) && (
        <ServiceOrderTable 
          serviceOrders={filteredOrders}
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  );
};

export default Index;