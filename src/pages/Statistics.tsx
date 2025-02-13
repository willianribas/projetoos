
import React from "react";
import Statistics from "@/components/Statistics";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import { statusOptions } from "@/components/ServiceOrderContent";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

const StatisticsContent = () => {
  const { serviceOrders } = useServiceOrders();

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <div className="container mx-auto p-6 space-y-6 animate-fade-in">
          <Header />
          <div className="px-2 sm:px-0">
            <Statistics serviceOrders={serviceOrders} statusOptions={statusOptions} />
          </div>
        </div>
      </div>
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
