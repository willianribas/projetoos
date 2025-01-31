import React from "react";
import ADEMonitor from "@/components/ADEMonitor";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import Sidebar from "@/components/Sidebar";
import { SidebarContent } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar-context";
import Header from "@/components/Header";

const ADEMonitorContent = () => {
  const { serviceOrders } = useServiceOrders();
  
  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <Header />
      <div className="px-2 sm:px-0">
        <ADEMonitor serviceOrders={serviceOrders} />
      </div>
    </div>
  );
};

const ADEMonitorPage = () => {
  return (
    <ServiceOrderProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar />
          <SidebarContent>
            <ADEMonitorContent />
          </SidebarContent>
        </div>
      </SidebarProvider>
    </ServiceOrderProvider>
  );
};

export default ADEMonitorPage;