import Header from "@/components/Header";
import ADEMonitor from "@/components/ADEMonitor";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import ServiceOrderForm from "@/components/ServiceOrderForm";
import ServiceOrderTable from "@/components/ServiceOrderTable";
import { Sidebar } from "@/components/layout/Sidebar";
import { useState } from "react";
import { useForm } from "react-hook-form";

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

const IndexContent = () => {
  const { serviceOrders, createServiceOrder } = useServiceOrders();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      numeroos: "",
      patrimonio: "",
      equipamento: "",
      status: "",
      observacao: ""
    }
  });

  const handleSubmit = (data: any) => {
    createServiceOrder(data);
    form.reset();
    setIsFormOpen(false);
  };
  
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <Sidebar serviceOrders={serviceOrders} />
      <Header />
      <div className="px-2 sm:px-0">
        <ADEMonitor serviceOrders={serviceOrders} />
        <ServiceOrderForm 
          form={form}
          isOpen={isFormOpen}
          setIsOpen={setIsFormOpen}
          onSubmit={handleSubmit}
          statusOptions={statusOptions}
        />
        <ServiceOrderTable 
          serviceOrders={serviceOrders}
          getStatusColor={(status) => {
            switch (status) {
              case "ADE":
                return "text-blue-900";
              case "AVT":
                return "text-[#F97316]";
              case "EXT":
                return "text-[#9b87f5]";
              case "A.M":
                return "text-[#ea384c]";
              case "INST":
                return "text-pink-500";
              case "M.S":
                return "text-[#33C3F0]";
              case "OSP":
                return "text-[#22c55e]";
              case "E.E":
                return "text-[#F97316]";
              default:
                return "text-gray-500";
            }
          }}
          statusOptions={statusOptions}
          onUpdateServiceOrder={() => {}}
          onDeleteServiceOrder={() => {}}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
      </div>
      <div className="text-center text-sm text-foreground/60 py-4">
        &copy; {new Date().getFullYear()} Daily.Flow. Todos os direitos reservados.
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <ServiceOrderProvider>
          <IndexContent />
        </ServiceOrderProvider>
      </div>
    </div>
  );
};

export default Index;