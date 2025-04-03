
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

const DetailedServiceOrder = () => {
  const { serviceOrders } = useServiceOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("20"); // Default to 20 items per page
  
  const filteredOrders = serviceOrders.filter(order => {
    const matchesSearch = searchTerm === "" || 
      order.numeroos.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.equipamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.observacao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: "", label: "Todos os Status" },
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Todos os Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
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
              showDetailed={true}
              itemsPerPage={parseInt(itemsPerPage)}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailedServiceOrder;
