
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { ServiceOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMobileDetect } from "@/hooks/use-mobile";

interface ADEMonitorProps {
  serviceOrders: ServiceOrder[];
}

const ADEMonitor = ({ serviceOrders }: ADEMonitorProps) => {
  const navigate = useNavigate();
  const { isMobile } = useMobileDetect();
  const adeOrders = serviceOrders.filter(order => order.status === "ADE");
  const criticalAdeOrders = adeOrders.filter(order => order.priority === "critical");
  const adpdOrders = serviceOrders.filter(order => order.status === "ADPD");
  const msOrders = serviceOrders.filter(order => order.status === "M.S");

  if (adeOrders.length === 0 && msOrders.length === 0 && adpdOrders.length === 0) {
    return null;
  }

  // Calculate days for each ADE order
  const calculateDays = (createdAt: string): number => {
    return Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  // Find the oldest ADE order
  const adeOrdersWithDays = adeOrders.map(order => ({
    ...order,
    days: calculateDays(order.created_at || "")
  }));
  
  // Sort by days in descending order to get the oldest one first
  adeOrdersWithDays.sort((a, b) => b.days - a.days);
  
  // Get the oldest order's days
  const oldestAdeDays = adeOrdersWithDays.length > 0 ? adeOrdersWithDays[0].days : 0;
  
  // Determine color based on days
  const getDaysColor = (days: number): string => {
    if (days >= 6) return "text-red-500 font-bold";
    if (days >= 3) return "text-orange-500 font-medium";
    return "text-green-500";
  };

  return (
    <Card className="mb-6 sm:mb-8 mt-3 sm:mt-4 border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between py-3 sm:py-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 animate-pulse" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Notificações
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3 sm:pb-4">
        <div className="space-y-3 sm:space-y-4">
          <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center justify-between'} animate-fade-in`}>
            <div className="space-y-2 text-left">
              {adeOrders.length > 0 && (
                <p className={`${isMobile ? 'text-sm' : 'text-base'} text-foreground/90`}>
                  Você tem <span className="font-bold text-blue-400">{adeOrders.length}</span> {adeOrders.length === 1 ? 'OS' : 'ordens de serviço'} em ADE 
                  {oldestAdeDays > 0 && (
                    <span> há <span className={getDaysColor(oldestAdeDays)}>{oldestAdeDays}</span> dias</span>
                  )}.
                </p>
              )}
              
              {adpdOrders.length > 0 && (
                <p className={`${isMobile ? 'text-sm' : 'text-base'} text-foreground/90`}>
                  Você tem <span className="font-bold text-fuchsia-400">{adpdOrders.length}</span> {adpdOrders.length === 1 ? 'OS' : 'ordens de serviço'} em ADPD.
                </p>
              )}
              
              {criticalAdeOrders.length > 0 && (
                <p className={`${isMobile ? 'text-sm' : 'text-base'} text-foreground/90`}>
                  Você tem <span className="text-red-500 font-bold animate-pulse">{criticalAdeOrders.length}</span> {criticalAdeOrders.length === 1 ? 'OS marcada' : 'ordens de serviço marcadas'} como Crítica.
                </p>
              )}
            </div>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/ade-monitor')}
              className={`hover:bg-blue-500/10 transition-colors duration-300 hover:scale-105 ${isMobile ? 'w-full mt-2' : ''}`}
              size={isMobile ? "sm" : "default"}
            >
              Ver detalhes
            </Button>
          </div>
          
          {msOrders.length > 0 && (
            <p className="text-xs sm:text-base text-foreground/90 animate-fade-in text-left">
              Material Solicitado na O.S: {msOrders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <span className="font-medium hover:text-primary transition-colors">{order.numeroos}</span>
                  {index < msOrders.length - 1 && " | "}
                </React.Fragment>
              ))}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ADEMonitor;
