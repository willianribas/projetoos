import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useServiceOrders } from "@/components/ServiceOrderProvider";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/components/filters/ServiceOrderFilters";
import Sidebar from "@/components/Sidebar";
import { SidebarContent } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar-context";
import Header from "@/components/Header";
import StatusTimeAnalysis from "@/components/analysis/StatusTimeAnalysis";

const ADEMonitorPage = () => {
  const { serviceOrders } = useServiceOrders();

  const adeOrders = serviceOrders.filter(order => order.status === "ADE");
  const amOrders = serviceOrders.filter(order => order.status === "A.M");
  const msOrders = serviceOrders.filter(order => order.status === "M.S");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <SidebarContent>
          <div className="container mx-auto p-6 space-y-6 animate-fade-in">
            <Header />
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ordens de Serviço em ADE</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Número OS</TableHead>
                          <TableHead>Patrimônio</TableHead>
                          <TableHead>Equipamento</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data da Alteração</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adeOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.numeroos}</TableCell>
                            <TableCell>{order.patrimonio}</TableCell>
                            <TableCell>{order.equipamento}</TableCell>
                            <TableCell>
                              <span className={cn("px-2 py-1 rounded-md text-xs font-medium", getStatusColor(order.status))}>
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              {format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ordens de Serviço em A.M</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Número OS</TableHead>
                          <TableHead>Patrimônio</TableHead>
                          <TableHead>Equipamento</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data da Alteração</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {amOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.numeroos}</TableCell>
                            <TableCell>{order.patrimonio}</TableCell>
                            <TableCell>{order.equipamento}</TableCell>
                            <TableCell>
                              <span className={cn("px-2 py-1 rounded-md text-xs font-medium", getStatusColor(order.status))}>
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              {format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ordens de Serviço em M.S</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Número OS</TableHead>
                          <TableHead>Patrimônio</TableHead>
                          <TableHead>Equipamento</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data da Alteração</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {msOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.numeroos}</TableCell>
                            <TableCell>{order.patrimonio}</TableCell>
                            <TableCell>{order.equipamento}</TableCell>
                            <TableCell>
                              <span className={cn("px-2 py-1 rounded-md text-xs font-medium", getStatusColor(order.status))}>
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              {format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>

              <StatusTimeAnalysis serviceOrders={serviceOrders} />
            </div>
          </div>
        </SidebarContent>
      </div>
    </SidebarProvider>
  );
};

export default ADEMonitorPage;