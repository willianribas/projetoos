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
        <div className="container mx-auto p-6 space-y-6 animate-fade-in">
          <Header />
          <div className="px-2 sm:px-0">
            <Statistics serviceOrders={serviceOrders} statusOptions={statusOptions} />
          </div>
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