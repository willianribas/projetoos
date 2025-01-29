import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { ServiceOrder } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExportExcelProps {
  serviceOrders: ServiceOrder[];
  statusOptions: Array<{
    value: string;
    label: string;
  }>;
}

export const ExportExcel = ({ serviceOrders, statusOptions }: ExportExcelProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string | "all">("all");

  const filteredOrders = selectedStatus === "all" 
    ? serviceOrders
    : serviceOrders.filter(order => order.status === selectedStatus);

  const handleExport = () => {
    const data = filteredOrders.map(order => ({
      'Número OS': order.numeroos,
      'Patrimônio': order.patrimonio,
      'Equipamento': order.equipamento,
      'Status': order.status,
      'Observação': order.observacao || '',
      'Prioridade': order.priority || 'normal',
      'Data de Criação': new Date(order.created_at).toLocaleDateString('pt-BR')
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Ordens de Serviço");
    writeFile(wb, "ordens-servico.xlsx");
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">Exportar Excel</span>
      <div className="flex gap-2 items-center">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
        <Button 
          variant="outline" 
          onClick={handleExport}
          className="flex items-center gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Exportar Excel
        </Button>
      </div>
    </div>
  );
};