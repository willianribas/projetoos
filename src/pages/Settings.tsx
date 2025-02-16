
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatabaseBackup } from "@/components/quick-actions/settings/DatabaseBackup";
import { ExportPDF } from "@/components/quick-actions/settings/ExportPDF";
import { ExportExcel } from "@/components/quick-actions/settings/ExportExcel";
import { HistoryToggle } from "@/components/quick-actions/settings/HistoryToggle";
import { ThemeToggle } from "@/components/quick-actions/settings/ThemeToggle";
import { UserManagementContainer } from "@/components/quick-actions/settings/UserManagementContainer";
import { StatusManagement } from "@/components/quick-actions/settings/StatusManagement";
import { useServiceOrdersQuery } from "@/hooks/queries/useServiceOrders";
import { statusOptions as defaultStatusOptions } from "@/components/ServiceOrderContent";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [statusOptions, setStatusOptions] = useState(defaultStatusOptions);
  const { data: serviceOrders = [] } = useServiceOrdersQuery();
  const { user } = useAuth();
  
  const serviceOrderId = -1;

  const handleAddStatus = (newStatus: typeof statusOptions[0]) => {
    setStatusOptions(prev => [...prev, newStatus]);
  };

  const handleRemoveStatus = (statusValue: string) => {
    setStatusOptions(prev => prev.filter(status => status.value !== statusValue));
  };

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <div className="p-4 sm:p-8">
          <Header />
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6">Configurações</h2>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <Tabs defaultValue="general" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="general">Geral</TabsTrigger>
                  <TabsTrigger value="status">Status</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                  <ThemeToggle />
                  <HistoryToggle 
                    showHistory={showHistory} 
                    setShowHistory={setShowHistory}
                    serviceOrderId={serviceOrderId}
                  />
                  <DatabaseBackup />
                  <ExportPDF 
                    serviceOrders={serviceOrders}
                    statusOptions={statusOptions}
                  />
                  <ExportExcel 
                    serviceOrders={serviceOrders}
                    statusOptions={statusOptions}
                  />
                  {user?.email === "williann.dev@gmail.com" && (
                    <div>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowUserManagement(true)}
                        className="w-full"
                      >
                        Gerenciar Usuários
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="status">
                  <StatusManagement 
                    statusOptions={statusOptions}
                    onStatusAdd={handleAddStatus}
                    onStatusRemove={handleRemoveStatus}
                  />
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </Card>
          {showUserManagement && (
            <UserManagementContainer onClose={() => setShowUserManagement(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
