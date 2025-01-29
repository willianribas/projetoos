import Header from "@/components/Header";
import ADEMonitor from "@/components/ADEMonitor";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import ServiceOrderForm from "@/components/ServiceOrderForm";
import ServiceOrderTable from "@/components/ServiceOrderTable";
import { Sidebar } from "@/components/layout/Sidebar";
import { useState } from "react";

const IndexContent = () => {
  const { serviceOrders } = useServiceOrders();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <Sidebar serviceOrders={serviceOrders} />
      <Header />
      <div className="px-2 sm:px-0">
        <ADEMonitor serviceOrders={serviceOrders} />
        <ServiceOrderForm />
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
          statusOptions={[
            { value: "ADE", label: "ADE - Aguardando Disponibilidade", color: "text-blue-900", icon: null },
            { value: "AVT", label: "AVT - Aguardando vinda técnica", color: "text-[#F97316]", icon: null },
            { value: "EXT", label: "EXT - Serviço Externo", color: "text-[#9b87f5]", icon: null },
            { value: "A.M", label: "A.M - Aquisição de Material", color: "text-[#ea384c]", icon: null },
            { value: "INST", label: "INST - Instalação", color: "text-pink-500", icon: null },
            { value: "M.S", label: "M.S - Material Solicitado", color: "text-[#33C3F0]", icon: null },
            { value: "OSP", label: "OSP - Ordem de Serviço Pronta", color: "text-[#22c55e]", icon: null },
            { value: "E.E", label: "E.E - Em Execução", color: "text-[#F97316]", icon: null }
          ]}
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