import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { ServiceOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ADEMonitorProps {
  serviceOrders: ServiceOrder[];
}

const ADEMonitor = ({ serviceOrders }: ADEMonitorProps) => {
  const navigate = useNavigate();
  const adeOrders = serviceOrders.filter(order => order.status === "ADE");
  const criticalAdeOrders = adeOrders.filter(order => order.priority === "critical");

  if (adeOrders.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-400 animate-pulse" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Notificações
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-lg text-foreground/90">
            Você tem <span className="font-bold text-blue-400">{adeOrders.length}</span> {adeOrders.length === 1 ? 'ordem de serviço' : 'ordens de serviço'} em ADE
            {criticalAdeOrders.length > 0 && (
              <span>, {criticalAdeOrders.length} OS {criticalAdeOrders.length === 1 ? 'é' : 'são'} de equipamento crítico!</span>
            )}
          </p>
          <Button 
            variant="outline"
            onClick={() => navigate('/ade-monitor')}
            className="hover:bg-blue-500/10"
          >
            Ver detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ADEMonitor;