import React from "react";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import { SettingsPanel } from "@/components/quick-actions/SettingsPanel";
import Sidebar from "@/components/Sidebar";

const SettingsContent = () => {
  const { serviceOrders } = useServiceOrders();

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Daily.Flow Sistema de Gerenciamento de Ordens de Serviços</h1>
      <SettingsPanel showSettings={true} serviceOrders={serviceOrders} />
    </div>
  );
};

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 pl-16 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <ServiceOrderProvider>
              <SettingsContent />
            </ServiceOrderProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;