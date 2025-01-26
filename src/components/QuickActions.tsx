import React, { useState } from "react";
import { ServiceOrdersCard } from "./quick-actions/ServiceOrdersCard";
import { StatisticsCard } from "./quick-actions/StatisticsCard";
import { SettingsCard } from "./quick-actions/SettingsCard";
import { SettingsPanel } from "./quick-actions/SettingsPanel";
import { ServiceOrder } from "@/types";

interface QuickActionsProps {
  setShowTable: (show: boolean) => void;
  showTable: boolean;
  setShowStats: (show: boolean) => void;
  showStats: boolean;
  serviceOrders: ServiceOrder[];
}

const QuickActions = ({ 
  setShowTable, 
  showTable, 
  setShowStats, 
  showStats,
  serviceOrders
}: QuickActionsProps) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceOrdersCard 
          setShowTable={setShowTable}
          showTable={showTable}
          setShowStats={setShowStats}
          setShowSettings={setShowSettings}
        />
        <StatisticsCard 
          setShowStats={setShowStats}
          showStats={showStats}
          setShowTable={setShowTable}
          setShowSettings={setShowSettings}
        />
        <SettingsCard 
          setShowSettings={setShowSettings}
          showSettings={showSettings}
        />
      </div>

      <SettingsPanel 
        showSettings={showSettings}
        serviceOrders={serviceOrders}
      />
    </div>
  );
};

export default QuickActions;