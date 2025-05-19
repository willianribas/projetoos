
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSharedServiceOrders } from "@/hooks/useSharedServiceOrders";
import { Clock, Share2, Check, X, Loader2 } from "lucide-react";
import { getStatusColor } from "@/components/filters/ServiceOrderFilters";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function SharedServiceOrders() {
  const { receivedOrders, isLoading, acceptSharedOrder, rejectSharedOrder } = useSharedServiceOrders();
  
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
    <div className="grid gap-4">
      <h3 className="text-lg font-semibold">Ordens de Serviço Compartilhadas</h3>
      <div className="grid gap-3">
        {receivedOrders.map((sharedOrder) => (
          <Card key={sharedOrder.id} className="overflow-hidden">
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
