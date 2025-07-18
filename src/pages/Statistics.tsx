
import React from "react";
import Statistics from "@/components/Statistics";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import { statusOptions } from "@/components/ServiceOrderContent";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const StatisticsContent = () => {
  const { serviceOrders } = useServiceOrders();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold heading-gradient">Estatísticas</h1>
        </div>
        <Statistics serviceOrders={serviceOrders} statusOptions={statusOptions} />
      </div>
    </DashboardLayout>
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
