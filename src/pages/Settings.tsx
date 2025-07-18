
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatabaseBackup } from "@/components/quick-actions/settings/DatabaseBackup";
import { ExportPDF } from "@/components/quick-actions/settings/ExportPDF";
import { ExportExcel } from "@/components/quick-actions/settings/ExportExcel";
import { HistoryToggle } from "@/components/quick-actions/settings/HistoryToggle";
import { ThemeToggle } from "@/components/quick-actions/settings/ThemeToggle";
import { UserManagementContainer } from "@/components/quick-actions/settings/UserManagementContainer";
import { RecycleBin } from "@/components/quick-actions/settings/RecycleBin";
import { useServiceOrdersQuery } from "@/hooks/queries/useServiceOrders";
import { statusOptions } from "@/components/ServiceOrderContent";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const Settings = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const { data: serviceOrders = [] } = useServiceOrdersQuery();
  const { user } = useAuth();
  
  const serviceOrderId = -1;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold heading-gradient">Configurações</h1>
        </div>
        
        <Card className="modern-card">
          <ScrollArea className="h-[calc(100vh-16rem)] p-6">
            <div className="space-y-6">
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
              
              <RecycleBin />
            </div>
          </ScrollArea>
        </Card>
        
        {showUserManagement && (
          <UserManagementContainer onClose={() => setShowUserManagement(false)} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
