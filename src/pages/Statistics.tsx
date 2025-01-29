import React from "react";
import Statistics from "@/components/Statistics";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import Sidebar from "@/components/Sidebar";
import { SidebarContent } from "@/components/ui/sidebar";

const statusOptions = [
  { value: "ADE", label: "Aguardando Disponibilidade", color: "text-yellow-500" },
  { value: "AVT", label: "Avaliação Técnica", color: "text-blue-500" },
  { value: "EXT", label: "Externo", color: "text-[#F97316]" },
  { value: "A.M", label: "Aguardando Material", color: "text-[#9b87f5]" },
  { value: "INST", label: "Instalação", color: "text-[#ea384c]" },
  { value: "M.S", label: "Manutenção em Série", color: "text-pink-500" },
  { value: "E.E", label: "Em Execução", color: "text-[#33C3F0]" },
  { value: "OSP", label: "OS Pronta", color: "text-[#22c55e]" },
  { value: "CAN", label: "Cancelada", color: "text-red-500" },
];

const StatisticsContent = () => {
  const { serviceOrders } = useServiceOrders();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <SidebarContent>
        <Statistics serviceOrders={serviceOrders} statusOptions={statusOptions} />
      </SidebarContent>
    </div>
  );
};

const StatisticsPage = () => {
  return (
    <ServiceOrderProvider>
      <StatisticsContent />
    </ServiceOrderProvider>
  );
};

export default StatisticsPage;