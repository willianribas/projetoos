
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
import MetricsHighlight from "./charts/MetricsHighlight";
import { ScrollArea } from "./ui/scroll-area";
import ExportableReports from "./charts/ExportableReports";

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
    if (!order.patrimonio) return acc;
    acc[order.patrimonio] = (acc[order.patrimonio] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Contagem por equipamento
  const equipamentoCount = serviceOrders.reduce((acc, order) => {
    if (!order.equipamento) return acc;
    acc[order.equipamento] = (acc[order.equipamento] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 p-6 animate-fade-in">
      <MetricsHighlight serviceOrders={serviceOrders} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <StatusDistributionChart 
              serviceOrders={serviceOrders} 
              statusOptions={statusOptions} 
            />
            <TimelineChart serviceOrders={serviceOrders} />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <ExportableReports 
            serviceOrders={serviceOrders}
            statusOptions={statusOptions}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Qtd.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statusOptions.map((status) => (
                    <TableRow key={status.value} className="hover:bg-muted/50">
                      <TableCell>
                        <span className={`${status.color} font-medium`}>
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {statusCount[status.value] || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Patrimônio</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patrimônio</TableHead>
                    <TableHead className="text-right">Qtd.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(patrimonioCount)
                    .sort(([, a], [, b]) => b - a)
                    .map(([patrimonio, count]) => (
                      <TableRow key={patrimonio} className="hover:bg-muted/50">
                        <TableCell>{patrimonio}</TableCell>
                        <TableCell className="text-right font-medium">{count}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Equipamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipamento</TableHead>
                    <TableHead className="text-right">Qtd.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(equipamentoCount)
                    .sort(([, a], [, b]) => b - a)
                    .map(([equipamento, count]) => (
                      <TableRow key={equipamento} className="hover:bg-muted/50">
                        <TableCell>{equipamento}</TableCell>
                        <TableCell className="text-right font-medium">{count}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
