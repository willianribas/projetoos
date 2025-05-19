
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSharedServiceOrders } from "@/hooks/useSharedServiceOrders";
import { Clock, Share2, Check, X, Loader2 } from "lucide-react";
import { getStatusColor } from "@/components/filters/ServiceOrderFilters";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNotificationSound } from "@/lib/useNotificationSound";
import { toast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

export function SharedServiceOrders() {
  const { receivedOrders, isLoading, acceptSharedOrder, rejectSharedOrder } = useSharedServiceOrders();
  const { play } = useNotificationSound();
  const location = useLocation();
  
  // Effect to show notification and play sound when new orders are received
  useEffect(() => {
    // Only show notification if there are received orders and we're not loading
    if (!isLoading && receivedOrders.length > 0) {
      // Play notification sound
      play();
      
      // Show toast notification
      toast({
        title: `${receivedOrders.length} ordem(s) compartilhada(s)`,
        description: "Você recebeu ordens de serviço compartilhadas.",
        variant: "success",
      });
    }
  }, [receivedOrders.length, isLoading]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (receivedOrders.length === 0) {
    return null;
  }
  
  return (
    <div className="grid gap-4 animate-fade-in">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Share2 className="h-5 w-5 text-purple-500" />
        Ordens de Serviço Compartilhadas
        <Badge variant="outline" className="ml-1 bg-purple-500/10 text-purple-600 dark:text-purple-400">
          {receivedOrders.length}
        </Badge>
      </h3>
      <div className="grid gap-3">
        {receivedOrders.map((sharedOrder) => (
          <Card key={sharedOrder.id} className="overflow-hidden border-muted bg-card/50 backdrop-blur-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base">OS #{sharedOrder.service_orders.numeroos}</CardTitle>
                  <CardDescription>
                    Enviada por {sharedOrder.profiles.full_name || "Usuário"} em {" "}
                    {format(new Date(sharedOrder.shared_at), "dd/MM/yyyy HH:mm")}
                  </CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        className={getStatusColor(sharedOrder.service_orders.status)}
                        variant="outline"
                      >
                        {sharedOrder.service_orders.status}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      Status da ordem de serviço
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Patrimônio:</span> {sharedOrder.service_orders.patrimonio}
                </div>
                <div>
                  <span className="font-medium">Equipamento:</span> {sharedOrder.service_orders.equipamento}
                </div>
                {sharedOrder.service_orders.priority && (
                  <div>
                    <span className="font-medium">Prioridade:</span> {sharedOrder.service_orders.priority}
                  </div>
                )}
                {sharedOrder.message && (
                  <div className="mt-3 p-2 bg-muted/50 rounded-md">
                    <span className="font-medium">Mensagem:</span> {sharedOrder.message}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-0">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => rejectSharedOrder(sharedOrder.id)}
              >
                <X className="mr-1 h-3 w-3" /> Recusar
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => acceptSharedOrder(sharedOrder.id)}
              >
                <Check className="mr-1 h-3 w-3" /> Aceitar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
