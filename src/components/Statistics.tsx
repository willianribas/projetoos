
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
    <div className="space-y-8 p-4 md:p-6 animate-fade-in">
      {/* Metrics Highlight Section */}
      <div className="mb-8">
        <MetricsHighlight serviceOrders={serviceOrders} />
      </div>
      
      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Distribuição de Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusDistributionChart 
                serviceOrders={serviceOrders} 
                statusOptions={statusOptions} 
              />
            </CardContent>
          </Card>
          
          <Card className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Timeline de OS</CardTitle>
            </CardHeader>
            <CardContent>
              <TimelineChart serviceOrders={serviceOrders} />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-4">
          <Card className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <ExportableReports 
                serviceOrders={serviceOrders}
                statusOptions={statusOptions}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
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
          <CardHeader className="pb-2">
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
          <CardHeader className="pb-2">
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
