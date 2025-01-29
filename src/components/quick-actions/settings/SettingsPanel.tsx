import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { ServiceOrder } from "@/types";
import { ThemeToggle } from "@/components/quick-actions/settings/ThemeToggle";
import { ExportPDF } from "@/components/quick-actions/settings/ExportPDF";
import { DatabaseBackup } from "@/components/quick-actions/settings/DatabaseBackup";
import { HistoryToggle } from "@/components/quick-actions/settings/HistoryToggle";
import { Button } from "@/components/ui/button";
import { UserManagementContainer } from "@/components/quick-actions/settings/user-management/UserManagementContainer";
import { useAuth } from "@/components/AuthProvider";
import { statusOptions } from "@/components/ServiceOrderContent";
import { ChangeOwnPasswordDialog } from "@/components/quick-actions/settings/user-management/dialogs/ChangeOwnPasswordDialog";

interface SettingsPanelProps {
  showSettings: boolean;
  serviceOrders: ServiceOrder[];
}

export const SettingsPanel = ({ showSettings, serviceOrders }: SettingsPanelProps) => {
  const [showHistory, setShowHistory] = React.useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const { user } = useAuth();

  if (!showSettings) return null;

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow border-muted bg-card/50 backdrop-blur-sm animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5 text-gray-400" />
            Ajustes do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ThemeToggle />
          <ExportPDF serviceOrders={serviceOrders} statusOptions={statusOptions} />
          <DatabaseBackup />
          <HistoryToggle showHistory={showHistory} setShowHistory={setShowHistory} />
          <ChangeOwnPasswordDialog />
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
        </CardContent>
      </Card>

      {showUserManagement && (
        <UserManagementContainer onClose={() => setShowUserManagement(false)} />
      )}
    </>
  );
};