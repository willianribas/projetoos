import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ServiceOrder {
  numeroOS: string;
  patrimonio: string;
  equipamento: string;
  status: string;
  observacao: string;
}

interface ServiceOrderTableProps {
  serviceOrders: ServiceOrder[];
  getStatusColor: (status: string) => string;
}

const ServiceOrderTable = ({ serviceOrders, getStatusColor }: ServiceOrderTableProps) => {
  return (
    <Card className="mt-8 border-muted bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Ordens de Serviço Registradas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número OS</TableHead>
              <TableHead>Patrimônio</TableHead>
              <TableHead>Equipamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Observação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {serviceOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{order.numeroOS}</TableCell>
                <TableCell>{order.patrimonio}</TableCell>
                <TableCell>{order.equipamento}</TableCell>
                <TableCell>
                  <span className={`${getStatusColor(order.status)} border rounded px-2 py-1`} style={{ borderColor: 'currentColor' }}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{order.observacao}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ServiceOrderTable;