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
import { useEquipmentsQuery } from "@/hooks/queries/useEquipments";
import { useUser } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import { useAnalyzersQuery } from "@/hooks/queries/useAnalyzers";
import { AnalyzerNotification } from "@/components/analyzer/AnalyzerNotification";

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
  const { user } = useUser();
  const {
    data: serviceOrders,
    isLoading: isLoadingServiceOrders,
    refetch: refetchServiceOrders,
  } = useServiceOrdersQuery();
  const {
    data: equipments,
    isLoading: isLoadingEquipments,
    refetch: refetchEquipments,
  } = useEquipmentsQuery();
  const { data: analyzers } = useAnalyzersQuery();

  useEffect(() => {
    refetchServiceOrders();
    refetchEquipments();
  }, [user, refetchServiceOrders, refetchEquipments]);

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-8 animate-fade-in">
          {/* Add the analyzer notification component */}
          {analyzers && <AnalyzerNotification analyzers={analyzers} />}
          
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <CardComponent
              title="Ordens de Serviço"
              value={serviceOrders?.length ?? 0}
              isLoading={isLoadingServiceOrders}
            />
            <CardComponent
              title="Equipamentos"
              value={equipments?.length ?? 0}
              isLoading={isLoadingEquipments}
            />
            <CardComponent
              title="Usuário"
              value={user?.email ?? "N/A"}
              isLoading={!user}
            />
            <CardComponent title="Role" value="N/A" isLoading={true} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
