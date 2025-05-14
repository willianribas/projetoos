
import React from "react";
import { useSharedServiceOrders } from "@/hooks/useSharedServiceOrders";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Share2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

const SharedServiceOrders = () => {
  const {
    sharedOrders,
    isLoading,
    acceptOrder,
    declineOrder,
    toggleExpand,
    isExpanded,
    isAccepting,
    isDeclining,
  } = useSharedServiceOrders();

  if (isLoading) {
    return (
      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle>Ordens Compartilhadas</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-md p-4 space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingShares = sharedOrders.filter((share) => !share.is_accepted);
  const acceptedShares = sharedOrders.filter((share) => share.is_accepted);

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      ADE: "bg-blue-900",
      AVT: "bg-[#F97316]",
      EXT: "bg-[#9b87f5]",
      "A.M": "bg-[#ea384c]",
      INST: "bg-pink-500",
      "M.S": "bg-[#33C3F0]",
      OSP: "bg-[#22c55e]",
      "E.E": "bg-[#F97316]",
      ADPD: "bg-[#D946EF]",
    };
    return statusMap[status] || "bg-gray-500";
  };

  if (!pendingShares.length && !acceptedShares.length) {
    return (
      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Ordens Compartilhadas
          </CardTitle>
          <CardDescription>
            Você não tem ordens de serviço compartilhadas com você.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Ordens Compartilhadas
        </CardTitle>
        <CardDescription>
          Ordens de serviço compartilhadas com você
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {pendingShares.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Pendentes ({pendingShares.length})
                </h3>
                <div className="space-y-3">
                  {pendingShares.map((share) => (
                    <div
                      key={share.id}
                      className="border border-border rounded-md overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">
                              {share.order?.numeroos || "OS sem número"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Compartilhado por {share.sharer_name}
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(share.id)}
                          >
                            {isExpanded(share.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {format(new Date(share.shared_at), "dd MMM yyyy, HH:mm", { locale: ptBR })}
                          </div>
                          <Badge
                            className={getStatusColor(share.order?.status || "")}
                          >
                            {share.order?.status || "Sem status"}
                          </Badge>
                        </div>
                        
                        {share.message && (
                          <div className="mt-2 bg-muted p-2 rounded-sm text-sm flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div>{share.message}</div>
                          </div>
                        )}
                        
                        {isExpanded(share.id) && share.order && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Patrimônio:</span>{" "}
                                {share.order.patrimonio}
                              </div>
                              <div>
                                <span className="font-medium">Equipamento:</span>{" "}
                                {share.order.equipamento}
                              </div>
                              {share.order.observacao && (
                                <div className="col-span-2 mt-1">
                                  <span className="font-medium">Observação:</span>{" "}
                                  <p className="text-muted-foreground">
                                    {share.order.observacao}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-3 flex gap-2 justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => declineOrder(share.id)}
                            disabled={isDeclining}
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Recusar
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => acceptOrder(share.id)}
                            disabled={isAccepting}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Aceitar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {acceptedShares.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Aceitas ({acceptedShares.length})
                </h3>
                <div className="space-y-3">
                  {acceptedShares.map((share) => (
                    <div
                      key={share.id}
                      className="border border-border rounded-md overflow-hidden bg-muted/30"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">
                              {share.order?.numeroos || "OS sem número"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Compartilhado por {share.sharer_name}
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(share.id)}
                          >
                            {isExpanded(share.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            Aceito em {format(new Date(share.shared_at), "dd MMM yyyy", { locale: ptBR })}
                          </div>
                          <Badge
                            className={getStatusColor(share.order?.status || "")}
                          >
                            {share.order?.status || "Sem status"}
                          </Badge>
                        </div>
                        
                        {isExpanded(share.id) && share.order && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Patrimônio:</span>{" "}
                                {share.order.patrimonio}
                              </div>
                              <div>
                                <span className="font-medium">Equipamento:</span>{" "}
                                {share.order.equipamento}
                              </div>
                              {share.order.observacao && (
                                <div className="col-span-2 mt-1">
                                  <span className="font-medium">Observação:</span>{" "}
                                  <p className="text-muted-foreground">
                                    {share.order.observacao}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SharedServiceOrders;
