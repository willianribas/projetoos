
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useServiceOrders } from "@/components/ServiceOrderProvider";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/components/filters/ServiceOrderFilters";
import Header from "@/components/Header";
import StatusTimeAnalysis from "@/components/analysis/StatusTimeAnalysis";
import { Hash, Building2, Settings2, StickyNote, ActivitySquare, Clock, Bell, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import AddNotificationDialog from "@/components/AddNotificationDialog";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

const ADEMonitorPage = () => {
  const { serviceOrders } = useServiceOrders();
  const { notifications, removeNotification } = useNotifications();

  const adeOrders = serviceOrders.filter(order => order.status === "ADE");
  const amOrders = serviceOrders.filter(order => order.status === "A.M");
  const msOrders = serviceOrders.filter(order => order.status === "M.S");

  const TableWithObservation = ({ orders, title }: { orders: typeof adeOrders, title: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <span>Número OS</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>Patrimônio</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    <span>Equipamento</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4" />
                    <span>Observação</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <ActivitySquare className="h-4 w-4" />
                    <span>Status</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Data da Alteração</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-left">{order.numeroos}</TableCell>
                  <TableCell className="text-left">{order.patrimonio}</TableCell>
                  <TableCell className="text-left">{order.equipamento}</TableCell>
                  <TableCell className="text-left">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="max-w-[200px] truncate">
                            {order.observacao || "-"}
                          </div>
                        </TooltipTrigger>
                        {order.observacao && (
                          <TooltipContent>
                            <p className="max-w-[300px] text-sm">{order.observacao}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className={cn("px-2 py-1 rounded-md text-xs font-medium", getStatusColor(order.status))}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    {format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const formatNotificationDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <div className="container mx-auto p-6 space-y-6 animate-fade-in">
          <Header />
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-400" />
              Notificações
            </h2>
            <AddNotificationDialog />
          </div>
          
          {notifications.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Notificações Personalizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {notifications.map(notification => (
                      <div key={notification.id} className="flex items-start justify-between gap-4 border-b pb-4 last:border-0">
                        <div className="flex-grow">
                          <h3 className="text-base font-medium">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                          <span className="text-xs text-blue-400 mt-2 block">
                            {formatNotificationDate(notification.createdAt)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-600 hover:bg-red-100/10"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
          
          <div className="grid gap-6">
            <TableWithObservation orders={adeOrders} title="Ordens de Serviço em ADE" />
            <TableWithObservation orders={amOrders} title="Ordens de Serviço em A.M" />
            <TableWithObservation orders={msOrders} title="Ordens de Serviço em M.S" />
            <StatusTimeAnalysis serviceOrders={serviceOrders} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ADEMonitorPage;
