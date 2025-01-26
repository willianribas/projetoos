import { useState } from "react";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/SearchBar";
import ServiceOrderForm from "@/components/ServiceOrderForm";
import QuickActions from "@/components/QuickActions";
import ServiceOrderTable from "@/components/ServiceOrderTable";
import Statistics from "@/components/Statistics";
import { useServiceOrders } from "./ServiceOrderProvider";

export const statusOptions = [
  { value: "ADE", label: "ADE - Aguardando Disponibilidade", color: "text-blue-900" },
  { value: "AVT", label: "AVT - Aguardando vinda técnica", color: "text-[#F97316]" },
  { value: "EXT", label: "EXT - Serviço Externo", color: "text-[#9b87f5]" },
  { value: "A.M", label: "A.M - Aquisição de Material", color: "text-[#ea384c]" },
  { value: "INST", label: "INST - Instalação", color: "text-pink-500" },
  { value: "M.S", label: "M.S - Material Solicitado", color: "text-[#33C3F0]" },
  { value: "OSP", label: "OSP - Ordem de Serviço Pronta", color: "text-[#22c55e]" },
  { value: "E.E", label: "E.E - Em Execução", color: "text-[#F97316]" }
];

export default function ServiceOrderContent() {
  const form = useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  
  const { serviceOrders, createServiceOrder, updateServiceOrder, deleteServiceOrder } = useServiceOrders();

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || "text-muted-foreground";
  };

  const onSubmit = (data: any) => {
    createServiceOrder(data);
    form.reset();
    setIsOpen(false);
  };

  const filteredOrders = serviceOrders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (order.numeroos?.toLowerCase() || "").includes(searchLower) ||
      (order.patrimonio?.toLowerCase() || "").includes(searchLower) ||
      (order.equipamento?.toLowerCase() || "").includes(searchLower) ||
      (order.status?.toLowerCase() || "").includes(searchLower) ||
      (order.observacao?.toLowerCase() || "").includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      <ServiceOrderForm 
        form={form}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={onSubmit}
        statusOptions={statusOptions}
      />
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
          onUpdateServiceOrder={(index, updatedOrder) => {
            const order = serviceOrders[index];
            if (order) {
              updateServiceOrder(order.id, updatedOrder);
            }
          }}
          onDeleteServiceOrder={(index) => {
            const order = serviceOrders[index];
            if (order) {
              deleteServiceOrder(order.id);
            }
          }}
        />
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