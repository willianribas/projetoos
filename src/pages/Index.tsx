
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
import { ActivitySquare, Building2, GripHorizontal, Hash, MessageSquare, Settings2, StickyNote, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  const {
    data: serviceOrders,
    isLoading: isLoadingServiceOrders,
    refetch: refetchServiceOrders,
  } = useServiceOrdersQuery();
  
  const { data: analyzers } = useAnalyzersQuery();

  useEffect(() => {
    refetchServiceOrders();
  }, [user, refetchServiceOrders]);

  // Define status options and color getter for ServiceOrderTable
  const statusOptions = [
    { value: "Aguardando Peça", label: "Aguardando Peça", color: "bg-orange-500", icon: Settings2 },
    { value: "Em Andamento", label: "Em Andamento", color: "bg-blue-500", icon: ActivitySquare },
    { value: "Concluído", label: "Concluído", color: "bg-green-500", icon: MessageSquare },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aguardando Peça":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-400";
      case "Em Andamento":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400";
      case "Concluído":
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const handleStatusChange = (status: string | null) => {
    setSelectedStatus(status);
  };

  const handleUpdateServiceOrder = (index: number, updatedOrder: any) => {
    console.log("Updating service order:", index, updatedOrder);
    // Implementation would use a mutation to update the service order
  };

  const handleDeleteServiceOrder = (id: number) => {
    console.log("Deleting service order:", id);
    // Implementation would use a mutation to delete the service order
  };

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-8 animate-fade-in">
          <Header />
          
          {/* Analyzer Notification */}
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
              getStatusColor={getStatusColor}
              statusOptions={statusOptions}
              onUpdateServiceOrder={handleUpdateServiceOrder}
              onDeleteServiceOrder={handleDeleteServiceOrder}
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
