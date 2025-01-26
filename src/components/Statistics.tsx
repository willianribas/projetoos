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
import { ServiceOrder } from "@/types";
import StatusDistributionChart from "./charts/StatusDistributionChart";
import TimelineChart from "./charts/TimelineChart";

interface StatisticsProps {
  serviceOrders: ServiceOrder[];
  statusOptions: Array<{
    value: string;
    label: string;
    color: string;
  }>;
}

const Statistics = ({ serviceOrders, statusOptions }: StatisticsProps) => {
  // Contagem por status
  const statusCount = serviceOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Contagem por patrimônio
  const patrimonioCount = serviceOrders.reduce((acc, order) => {
    acc[order.patrimonio] = (acc[order.patrimonio] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Contagem por equipamento
  const equipamentoCount = serviceOrders.reduce((acc, order) => {
    acc[order.equipamento] = (acc[order.equipamento] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDistributionChart 
          serviceOrders={serviceOrders} 
          statusOptions={statusOptions} 
        />
        <TimelineChart serviceOrders={serviceOrders} />
      </div>

      <Card className="border-muted bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Estatísticas por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Quantidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statusOptions.map((status) => (
                <TableRow key={status.value}>
                  <TableCell>
                    <span className={`${status.color} font-medium`}>
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell>{statusCount[status.value] || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-muted bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Estatísticas por Patrimônio</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patrimônio</TableHead>
                <TableHead>Quantidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(patrimonioCount).map(([patrimonio, count]) => (
                <TableRow key={patrimonio}>
                  <TableCell>{patrimonio}</TableCell>
                  <TableCell>{count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-muted bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Estatísticas por Equipamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipamento</TableHead>
                <TableHead>Quantidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(equipamentoCount).map(([equipamento, count]) => (
                <TableRow key={equipamento}>
                  <TableCell>{equipamento}</TableCell>
                  <TableCell>{count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;