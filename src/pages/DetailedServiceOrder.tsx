
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
import { Clock, FileDown, History } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { statusOptions } from "@/components/ServiceOrderContent";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlobProvider } from "@react-pdf/renderer";
import ServiceOrderPDF from "@/components/ServiceOrderPDF";
import EditServiceOrderDialog from "@/components/EditServiceOrderDialog";
import { useUpdateServiceOrder } from "@/hooks/mutations/useUpdateServiceOrder";

const DetailedServiceOrder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [searchCriteria, setSearchCriteria] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Default to 20 items per page
  const [exportStatus, setExportStatus] = useState<string | "all">("all");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [editOrderId, setEditOrderId] = useState<number | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedOrder, setEditedOrder] = useState<any>(null);
  
  const { serviceOrders } = useServiceOrders();
  
  // Check for edit parameter in URL
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
      const orderToEdit = serviceOrders.find(order => order.id === parseInt(editId));
      if (orderToEdit) {
        setEditedOrder(orderToEdit);
        setIsEditDialogOpen(true);
      }
      // Remove the parameter from URL without reloading
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [serviceOrders]);

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

  const ordersToExport = exportStatus === "all" 
    ? filteredOrders
    : filteredOrders.filter(order => order.status === exportStatus);

  const updateServiceOrderMutation = useUpdateServiceOrder();

  const handleSaveEdit = () => {
    if (editedOrder) {
      updateServiceOrderMutation.mutate(editedOrder);
      setIsEditDialogOpen(false);
      setEditedOrder(null);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <div className="container mx-auto p-6 space-y-6 animate-fade-in">
          <Header />
          <div className="px-2 sm:px-0">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchField={searchField}
                  setSearchField={setSearchField}
                  searchCriteria={searchCriteria}
                  setSearchCriteria={setSearchCriteria}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  className="whitespace-nowrap"
                  onClick={() => setShowExportOptions(!showExportOptions)}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>

                <Select 
                  value={itemsPerPage.toString()} 
                  onValueChange={(value) => {
                    setItemsPerPage(parseInt(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Itens por página" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 por página</SelectItem>
                    <SelectItem value="20">20 por página</SelectItem>
                    <SelectItem value="50">50 por página</SelectItem>
                    <SelectItem value="100">100 por página</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showExportOptions && (
              <Card className="mb-4 p-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <h3 className="text-sm font-medium">Exportar Ordens de Serviço:</h3>
                  <div className="flex items-center gap-2 flex-1">
                    <Select value={exportStatus} onValueChange={setExportStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as OS</SelectItem>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <BlobProvider document={<ServiceOrderPDF serviceOrders={ordersToExport} />}>
                      {({ url, loading }) => (
                        <Button 
                          variant="outline" 
                          disabled={loading} 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => {
                            if (url) {
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = 'ordens-servico.pdf';
                              link.click();
                            }
                          }}
                        >
                          <FileDown className="mr-2 h-4 w-4" />
                          {loading ? "Gerando PDF..." : "Exportar PDF"}
                        </Button>
                      )}
                    </BlobProvider>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowExportOptions(false)}
                    className="self-end"
                  >
                    Fechar
                  </Button>
                </div>
              </Card>
            )}

            <Card className="mt-4">
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

            <EditServiceOrderDialog
              isOpen={isEditDialogOpen}
              setIsOpen={setIsEditDialogOpen}
              editedOrder={editedOrder}
              setEditedOrder={setEditedOrder}
              statusOptions={statusOptions}
              onSave={handleSaveEdit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedServiceOrder;
