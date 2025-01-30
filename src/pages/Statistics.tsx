import React from "react";
import Statistics from "@/components/Statistics";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import Sidebar from "@/components/Sidebar";
import { SidebarContent } from "@/components/ui/sidebar";
import { statusOptions } from "@/components/ServiceOrderContent";
import Header from "@/components/Header";

const StatisticsContent = () => {
  const { serviceOrders } = useServiceOrders();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <SidebarContent>
        <div className="p-6 space-y-6">
          <Header />
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