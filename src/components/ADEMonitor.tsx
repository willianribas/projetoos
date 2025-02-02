import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock } from "lucide-react";
import { ServiceOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ADEMonitorProps {
  serviceOrders: ServiceOrder[];
}

const ADEMonitor = ({ serviceOrders }: ADEMonitorProps) => {
  const navigate = useNavigate();
  const adeOrders = serviceOrders.filter(order => order.status === "ADE");
  const criticalAdeOrders = adeOrders.filter(order => order.priority === "critical");
  const msOrders = serviceOrders.filter(order => order.status === "M.S");
  const amOrders = serviceOrders.filter(order => order.status === "A.M");

  if (adeOrders.length === 0 && msOrders.length === 0 && amOrders.length === 0) {
    return null;
  }

  const renderOrderList = (orders: ServiceOrder[], title: string) => {
    if (orders.length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground/90">{title}</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">OS</th>
                <th className="text-left py-2 px-4">Patrimônio</th>
                <th className="text-left py-2 px-4">Equipamento</th>
                <th className="text-left py-2 px-4">Situação</th>
                <th className="text-left py-2 px-4">Data/Hora</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted/50">
                  <td className="py-2 px-4">{order.numeroos}</td>
                  <td className="py-2 px-4">{order.patrimonio}</td>
                  <td className="py-2 px-4">{order.equipamento}</td>
                  <td className="py-2 px-4">
                    <span className={`inline-flex items-center gap-1 ${
                      order.priority === "critical" ? "text-red-500" : "text-blue-500"
                    }`}>
                      <Clock className="h-4 w-4" />
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {format(new Date(order.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <Card className="mb-8 mt-4 border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-400 animate-pulse" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Notificações
          </span>
        </CardTitle>
        <Button 
          variant="outline"
          onClick={() => navigate('/ade-monitor')}
          className="hover:bg-blue-500/10"
        >
          Ver todos
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderOrderList(adeOrders, "Ordens em ADE")}
        {renderOrderList(msOrders, "Ordens com Material Solicitado")}
        {renderOrderList(amOrders, "Ordens em Aquisição de Material")}
      </CardContent>
    </Card>
  );
};

export default ADEMonitor;