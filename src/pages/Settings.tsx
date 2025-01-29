import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatabaseBackup } from "@/components/quick-actions/settings/DatabaseBackup";
import { ExportPDF } from "@/components/quick-actions/settings/ExportPDF";
import { HistoryToggle } from "@/components/quick-actions/settings/HistoryToggle";
import { ThemeToggle } from "@/components/quick-actions/settings/ThemeToggle";
import { UserManagementContainer } from "@/components/quick-actions/settings/UserManagementContainer";
import Sidebar from "@/components/Sidebar";
import { SidebarContent } from "@/components/ui/sidebar";
import { useServiceOrdersQuery } from "@/hooks/queries/useServiceOrders";
import { statusOptions } from "@/components/ServiceOrderContent";

const Settings = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const { data: serviceOrders = [] } = useServiceOrdersQuery();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <SidebarContent>
        <div className="p-4 sm:p-8">
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6">Configurações</h2>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-6">
                <ThemeToggle />
                <HistoryToggle 
                  showHistory={showHistory} 
                  setShowHistory={setShowHistory} 
                />
                <DatabaseBackup />
                <ExportPDF 
                  serviceOrders={serviceOrders}
                  statusOptions={statusOptions}
                />
                {showUserManagement && (
                  <UserManagementContainer onClose={() => setShowUserManagement(false)} />
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </SidebarContent>
    </div>
  );
};

export default Settings;