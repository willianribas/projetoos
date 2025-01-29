import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { BlobProvider } from "@react-pdf/renderer";
import ServiceOrderPDF from "../../ServiceOrderPDF";
import { ServiceOrder } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExportPDFProps {
  serviceOrders: ServiceOrder[];
  statusOptions: Array<{
    value: string;
    label: string;
  }>;
}

export const ExportPDF = ({ serviceOrders, statusOptions }: ExportPDFProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string | "all">("all");

  const filteredOrders = selectedStatus === "all" 
    ? serviceOrders
    : serviceOrders.filter(order => order.status === selectedStatus);

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">Exportar OS</span>
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
        <BlobProvider document={<ServiceOrderPDF serviceOrders={filteredOrders} />}>
          {({ url, loading }) => (
            <Button 
              variant="outline" 
              disabled={loading} 
              type="button"
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
    </div>
  );
};