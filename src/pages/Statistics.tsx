import React from "react";
import Statistics from "@/components/Statistics";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import Sidebar from "@/components/Sidebar";
import { SidebarContent } from "@/components/ui/sidebar";
import { statusOptions } from "@/components/ServiceOrderContent";

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