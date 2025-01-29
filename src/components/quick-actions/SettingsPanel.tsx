import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { ServiceOrder } from "@/types";
import { ThemeToggle } from "./settings/ThemeToggle";
import { ExportPDF } from "./settings/ExportPDF";
import { DatabaseBackup } from "./settings/DatabaseBackup";
import { HistoryToggle } from "./settings/HistoryToggle";
import { UserManagement } from "./settings/UserManagement";
import { statusOptions } from "../ServiceOrderContent";

interface SettingsPanelProps {
  showSettings: boolean;
  serviceOrders: ServiceOrder[];
}

export const SettingsPanel = ({ showSettings, serviceOrders }: SettingsPanelProps) => {
  const [showHistory, setShowHistory] = React.useState(false);

  if (!showSettings) return null;

  return (
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
        <UserManagement />
      </CardContent>
    </Card>
  );
};