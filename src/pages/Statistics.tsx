import React from "react";
import Statistics from "@/components/Statistics";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import Sidebar from "@/components/Sidebar";
import { SidebarContent } from "@/components/ui/sidebar";

const statusOptions = [
  { value: "pendente", label: "Pendente", color: "text-yellow-500" },
  { value: "em_andamento", label: "Em Andamento", color: "text-blue-500" },
  { value: "concluido", label: "Concluído", color: "text-green-500" },
  { value: "cancelado", label: "Cancelado", color: "text-red-500" },
];

const StatisticsContent = () => {
  const { serviceOrders } = useServiceOrders();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <SidebarContent>
        <div className="p-4 sm:p-8">
          <Statistics serviceOrders={serviceOrders} statusOptions={statusOptions} />
        </div>
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