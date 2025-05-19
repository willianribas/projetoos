
import React from "react";
import Statistics from "@/components/Statistics";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import { statusOptions } from "@/components/ServiceOrderContent";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { SharedServiceOrders } from "@/components/SharedServiceOrders";

const StatisticsContent = () => {
  const { serviceOrders } = useServiceOrders();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background/50 to-background">
      <Navbar />
      <div className="pt-16 pb-8">
        <div className="container mx-auto px-4 space-y-6 animate-fade-in">
          <Header />
          
          {/* Shared Service Orders Component */}
          <SharedServiceOrders />
          
          <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/40 shadow-sm">
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
