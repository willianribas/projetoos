
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, Clock, Package, Wrench } from "lucide-react";
import { ServiceOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface ADEMonitorProps {
  serviceOrders: ServiceOrder[];
}

const ADEMonitor = ({ serviceOrders }: ADEMonitorProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const adeOrders = serviceOrders.filter(order => order.status === "ADE");
  const criticalAdeOrders = adeOrders.filter(order => order.priority === "critical");
  const adpdOrders = serviceOrders.filter(order => order.status === "ADPD");
  const msOrders = serviceOrders.filter(order => order.status === "M.S");

  if (adeOrders.length === 0 && msOrders.length === 0 && adpdOrders.length === 0) {
    return null;
  }

  // Calculate days for each ADE order using the created_at field
  // This timestamp is reset whenever the status changes to ADE
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
  
  // Determine color and variant based on days
  const getDaysColorClass = (days: number): string => {
    if (days >= 8) return "bg-destructive/20 text-destructive border-destructive/30";
    if (days >= 5) return "bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30";
    if (days >= 3) return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30";
    return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
  };

  const getDaysVariant = (days: number): "default" | "secondary" | "destructive" | "outline" => {
    if (days >= 8) return "destructive";
    if (days >= 5) return "outline";
    return "secondary";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ADE":
        return Clock;
      case "ADPD":
        return Package;
      case "M.S":
        return Wrench;
      default:
        return Bell;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-6 sm:mb-8 mt-3 sm:mt-4 border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Bell className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">
              Notificações do Sistema
            </span>
            <Badge variant="outline" className="ml-auto">
              {adeOrders.length + adpdOrders.length + msOrders.length} total
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <AnimatePresence>
            {/* ADE Orders Section */}
            {adeOrders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground">
                    Ordens de Serviço em ADE
                  </h4>
                  <Badge variant="secondary" className="ml-auto">
                    {adeOrders.length} {adeOrders.length === 1 ? 'ordem' : 'ordens'}
                  </Badge>
                </div>
                
                <div className="grid gap-3 max-h-64 overflow-y-auto pr-2">
                  {adeOrdersWithDays.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => navigate(`/detailed-service-order?edit=${order.id}`)}
                      className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer hover:scale-[1.02] ${getDaysColorClass(order.days)}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              OS #{order.numeroos}
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                              ADE
                            </Badge>
                            {order.priority === "critical" && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Crítica
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground min-w-[80px]">Patrimônio:</span>
                              <span className="font-medium">{order.patrimonio}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground min-w-[80px]">Equipamento:</span>
                              <span className="font-medium truncate" title={order.equipamento}>
                                {order.equipamento}
                              </span>
                            </div>
                            {order.observacao && (
                              <div className="flex items-start gap-2">
                                <span className="text-muted-foreground min-w-[80px]">Observação:</span>
                                <span className="text-xs text-muted-foreground line-clamp-2">
                                  {order.observacao}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={getDaysVariant(order.days)} className="font-bold">
                            {order.days} {order.days === 1 ? 'dia' : 'dias'}
                          </Badge>
                          {order.days >= 8 && (
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ADPD Orders Section */}
            {adpdOrders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Package className="h-4 w-4 text-purple-500" />
                  </div>
                  <h4 className="font-medium text-foreground">
                    Aguardando Decisão de Proposta de Desativação
                  </h4>
                  <Badge variant="outline" className="ml-auto bg-purple-500/10 border-purple-500/30">
                    {adpdOrders.length} {adpdOrders.length === 1 ? 'ordem' : 'ordens'}
                  </Badge>
                </div>
                
                <div className="grid gap-3 max-h-64 overflow-y-auto pr-2">
                  {adpdOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border transition-all duration-300 hover:shadow-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              OS #{order.numeroos}
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-600 dark:text-purple-400">
                              ADPD
                            </Badge>
                            {order.priority === "critical" && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Crítica
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground min-w-[80px]">Patrimônio:</span>
                              <span className="font-medium">{order.patrimonio}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground min-w-[80px]">Equipamento:</span>
                              <span className="font-medium truncate" title={order.equipamento}>
                                {order.equipamento}
                              </span>
                            </div>
                            {order.observacao && (
                              <div className="flex items-start gap-2">
                                <span className="text-muted-foreground min-w-[80px]">Observação:</span>
                                <span className="text-xs text-muted-foreground line-clamp-2">
                                  {order.observacao}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Package className="h-4 w-4 text-purple-500" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Material Solicitation Section */}
            {msOrders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Wrench className="h-4 w-4 text-amber-500" />
                  </div>
                  <h4 className="font-medium text-foreground">
                    Material Solicitado
                  </h4>
                  <Badge variant="outline" className="ml-auto bg-amber-500/10 border-amber-500/30">
                    {msOrders.length} {msOrders.length === 1 ? 'solicitação' : 'solicitações'}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2 ml-8">
                  {msOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Badge 
                        variant="outline" 
                        className="bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 transition-colors cursor-pointer"
                      >
                        OS #{order.numeroos}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <motion.div 
            className="pt-4 border-t border-border/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="default"
              onClick={() => navigate('/ade-monitor')}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
              size="lg"
            >
              <Bell className="h-4 w-4 mr-2" />
              Ver Detalhes Completos
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ADEMonitor;
