import React from "react";
import { format } from "date-fns";
import { useServiceOrders } from "@/components/ServiceOrderProvider";
import SearchBar from "@/components/SearchBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ServiceOrderHistory } from "@/components/quick-actions/ServiceOrderHistory";
import { useState } from "react";
import ServiceOrderPagination from "@/components/pagination/ServiceOrderPagination";
import { filterServiceOrders, getStatusColor } from "@/components/filters/ServiceOrderFilters";
import { Clock, History } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { statusOptions } from "@/components/ServiceOrderContent";
import Sidebar from "@/components/Sidebar";
import { SidebarContent } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar-context";
import Header from "@/components/Header";

const DetailedServiceOrder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [searchCriteria, setSearchCriteria] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const itemsPerPage = 10;

  const { serviceOrders } = useServiceOrders();

  const filteredOrders = filterServiceOrders({
    serviceOrders,
    searchQuery,
    searchField,
    selectedStatus,
    searchCriteria,
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <SidebarContent>
          <div className="container mx-auto p-6 space-y-6 animate-fade-in">
            <Header />
            <h1 className="text-2xl font-bold mb-6">OS Detalhada</h1>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchField={searchField}
              setSearchField={setSearchField}
              searchCriteria={searchCriteria}
              setSearchCriteria={setSearchCriteria}
            />

            <Card>
              <CardHeader>
                <CardTitle>Ordens de Serviço</CardTitle>
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex space-x-2 pb-4">
                    <Badge
                      variant={selectedStatus === null ? "default" : "outline"}
                      className="cursor-pointer flex items-center gap-1 font-medium"
                      onClick={() => setSelectedStatus(null)}
                    >
                      Todos
                    </Badge>
                    {statusOptions.map((status) => {
                      const Icon = status.icon;
                      return (
                        <Badge
                          key={status.value}
                          variant={selectedStatus === status.value ? "default" : "outline"}
                          className={`cursor-pointer flex items-center gap-1 font-medium ${
                            selectedStatus === status.value ? "bg-primary text-primary-foreground" : status.color
                          }`}
                          onClick={() => setSelectedStatus(status.value)}
                        >
                          <Icon className="h-3 w-3" />
                          {status.value}
                        </Badge>
                      );
                    })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número OS</TableHead>
                        <TableHead>Patrimônio</TableHead>
                        <TableHead>Equipamento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Observação</TableHead>
                        <TableHead className="text-center">
                          <Clock className="h-4 w-4 inline-block mr-2" />
                          Data/Hora
                        </TableHead>
                        <TableHead className="text-center">
                          <History className="h-4 w-4 inline-block mr-2" />
                          Histórico
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedOrderId(order.id)}
                        >
                          <TableCell>{order.numeroos}</TableCell>
                          <TableCell>{order.patrimonio}</TableCell>
                          <TableCell>{order.equipamento}</TableCell>
                          <TableCell>
                            <span className={cn("px-2 py-1 rounded-md text-xs font-medium", getStatusColor(order.status))}>
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {order.observacao}
                          </TableCell>
                          <TableCell className="text-center">
                            {format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}
                          </TableCell>
                          <TableCell className="text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrderId(order.id);
                              }}
                              className="text-primary hover:text-primary/80"
                            >
                              <History className="h-4 w-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>

                {totalPages > 1 && (
                  <div className="mt-4">
                    <ServiceOrderPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Dialog open={selectedOrderId !== null} onOpenChange={() => setSelectedOrderId(null)}>
              <DialogContent className="max-w-3xl">
                <DialogTitle>Histórico da Ordem de Serviço</DialogTitle>
                {selectedOrderId && <ServiceOrderHistory serviceOrderId={selectedOrderId} />}
              </DialogContent>
            </Dialog>
          </div>
        </SidebarContent>
      </div>
    </SidebarProvider>
  );
};

export default DetailedServiceOrder;
