
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useServiceOrdersQuery } from "@/hooks/queries/useServiceOrders";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import { useAnalyzersQuery } from "@/hooks/queries/useAnalyzers";
import { AnalyzerNotification } from "@/components/analyzer/AnalyzerNotification";
import Header from "@/components/Header";
import ADENotification from "@/components/ADENotification";
import ADEMonitor from "@/components/ADEMonitor";
import QuickActions from "@/components/QuickActions";
import ServiceOrderTable from "@/components/ServiceOrderTable";

interface CardData {
  title: string;
  value: number | string;
  isLoading: boolean;
}

const CardComponent = ({ title, value, isLoading }: CardData) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-4 w-[100px]" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </CardContent>
  </Card>
);

const data = [
  { name: "Jan", total: 1200 },
  { name: "Fev", total: 2100 },
  { name: "Mar", total: 800 },
  { name: "Abr", total: 1600 },
  { name: "Mai", total: 900 },
  { name: "Jun", total: 1700 },
];

export default function Index() {
  const { user } = useAuth();
  const [showTable, setShowTable] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  const {
    data: serviceOrders,
    isLoading: isLoadingServiceOrders,
    refetch: refetchServiceOrders,
  } = useServiceOrdersQuery();
  
  const { data: analyzers } = useAnalyzersQuery();

  useEffect(() => {
    refetchServiceOrders();
  }, [user, refetchServiceOrders]);

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-8 animate-fade-in">
          <Header />
          
          {/* Analyzer Notification - Mantém o componente de notificação de analisadores */}
          {analyzers && <AnalyzerNotification analyzers={analyzers} />}
          
          {/* ADE Notifications */}
          {serviceOrders && <ADENotification serviceOrders={serviceOrders} />}
          
          {/* ADE Monitor */}
          {serviceOrders && <ADEMonitor serviceOrders={serviceOrders} />}
          
          {/* Quick Actions */}
          <QuickActions 
            setShowTable={setShowTable} 
            showTable={showTable} 
            setShowStats={setShowStats} 
            showStats={showStats}
            serviceOrders={serviceOrders || []}
          />
          
          {/* Service Order Table */}
          {showTable && serviceOrders && (
            <ServiceOrderTable 
              serviceOrders={serviceOrders} 
              title="Ordens de Serviço"
            />
          )}
        </div>
      </div>
    </div>
  );
}
