import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock } from "lucide-react";
import { ServiceOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ADEMonitorProps {
  serviceOrders: ServiceOrder[];
}

const ADEMonitor = ({ serviceOrders }: ADEMonitorProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDetailPage = location.pathname === "/ade-monitor";
  
  const adeOrders = serviceOrders.filter(order => order.status === "ADE");
  const criticalAdeOrders = adeOrders.filter(order => order.priority === "critical");
  const msOrders = serviceOrders.filter(order => order.status === "M.S");
  const amOrders = serviceOrders.filter(order => order.status === "A.M");

  if (adeOrders.length === 0 && msOrders.length === 0 && amOrders.length === 0) {
    return null;
  }

  const renderSimpleList = (orders: ServiceOrder[]) => {
    if (orders.length === 0) return null;

    return (
      <div className="space-y-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>OS {order.numeroos}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {format(new Date(order.created_at), "dd/MM HH:mm", { locale: ptBR })}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderDetailedList = (orders: ServiceOrder[], title: string) => {
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

  const renderMSNotification = (orders: ServiceOrder[]) => {
    if (orders.length === 0) return null;
    
    return (
      <div className="text-sm text-foreground/90 mt-2">
        Material Solicitado na O.S: {orders.map(order => `"${order.numeroos}"`).join(" | ")}
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
        {!isDetailPage && (
          <Button 
            variant="outline"
            onClick={() => navigate('/ade-monitor')}
            className="hover:bg-blue-500/10"
          >
            Ver todos
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {isDetailPage ? (
          <>
            {renderDetailedList(adeOrders, "Ordens em ADE")}
            {renderDetailedList(msOrders, "Ordens com Material Solicitado")}
            {renderDetailedList(amOrders, "Ordens em Aquisição de Material")}
          </>
        ) : (
          <>
            {adeOrders.length > 0 && (
              <div>
                <div className="text-sm font-medium text-foreground/90">
                  Você tem {adeOrders.length} {adeOrders.length === 1 ? 'ordem' : 'ordens'} de serviço em ADE
                  {criticalAdeOrders.length > 0 && `, ${criticalAdeOrders.length} OS ${criticalAdeOrders.length === 1 ? 'é' : 'são'} equipamento crítico`}!
                </div>
                {renderSimpleList(adeOrders)}
              </div>
            )}
            {msOrders.length > 0 && renderMSNotification(msOrders)}
            {amOrders.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground/90">Aquisição de Material</h3>
                {renderSimpleList(amOrders)}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ADEMonitor;