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
import { Hash, Building2, Settings2, StickyNote, ActivitySquare, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";

const ADEMonitorPage = () => {
  const { serviceOrders } = useServiceOrders();

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

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <div className="container mx-auto p-6 space-y-6 animate-fade-in">
          <Header />
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
