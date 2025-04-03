
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import ServiceOrderTable from "@/components/ServiceOrderTable";
import { useServiceOrders } from "@/components/ServiceOrderProvider";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { statusOptions } from "@/components/ServiceOrderContent";

const DetailedServiceOrder = () => {
  const { serviceOrders } = useServiceOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("20"); // Default to 20 items per page
  
  const filteredOrders = serviceOrders.filter(order => {
    const matchesSearch = searchTerm === "" || 
      order.numeroos.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.equipamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.observacao && order.observacao.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusOptionsList = [
    { value: "all", label: "Todos os Status" }, // Changed from empty string to "all"
    { value: "em_andamento", label: "Em Andamento" },
    { value: "pendente", label: "Pendente" },
    { value: "concluido", label: "Concluído" },
    { value: "cancelado", label: "Cancelado" }
  ];
  
  const perPageOptions = [
    { value: "10", label: "10 por página" },
    { value: "20", label: "20 por página" },
    { value: "50", label: "50 por página" },
    { value: "100", label: "100 por página" }
  ];

  // Function to determine status color based on status value
  const getStatusColor = (status: string) => {
    switch (status) {
      case "em_andamento":
        return "border-blue-500 text-blue-500 hover:bg-blue-500/10";
      case "pendente":
        return "border-yellow-500 text-yellow-500 hover:bg-yellow-500/10";
      case "concluido":
        return "border-green-500 text-green-500 hover:bg-green-500/10";
      case "cancelado":
        return "border-red-500 text-red-500 hover:bg-red-500/10";
      default:
        return "border-gray-500 text-gray-500 hover:bg-gray-500/10";
    }
  };
  
  // Mocked handlers for ServiceOrderTable props
  const handleUpdateServiceOrder = (index: number, updatedOrder: any) => {
    console.log("Update service order", index, updatedOrder);
  };
  
  const handleDeleteServiceOrder = (id: number) => {
    console.log("Delete service order", id);
  };
  
  const handleStatusChange = (status: string | null) => {
    // Convert "all" to empty string for filtering
    setStatusFilter(status && status !== "all" ? status : "");
  };

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <div className="p-4 sm:p-8">
          <Header />
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
              <div className="flex-1 space-y-2">
                <Label htmlFor="search">Pesquisar OS</Label>
                <Input
                  id="search"
                  placeholder="Número, equipamento ou observação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48 space-y-2">
                <Label htmlFor="status-filter">Filtrar por Status</Label>
                <Select 
                  value={statusFilter === "" ? "all" : statusFilter} 
                  onValueChange={(val) => setStatusFilter(val === "all" ? "" : val)}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Todos os Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptionsList.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48 space-y-2">
                <Label htmlFor="items-per-page">Itens por página</Label>
                <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                  <SelectTrigger id="items-per-page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {perPageOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <ServiceOrderTable 
              serviceOrders={filteredOrders} 
              getStatusColor={getStatusColor}
              statusOptions={statusOptions}
              onUpdateServiceOrder={handleUpdateServiceOrder}
              onDeleteServiceOrder={handleDeleteServiceOrder}
              selectedStatus={statusFilter === "" ? null : statusFilter}
              onStatusChange={handleStatusChange}
              itemsPerPage={parseInt(itemsPerPage)}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailedServiceOrder;
