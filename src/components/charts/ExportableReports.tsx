
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileText, FileType, Printer } from 'lucide-react';
import { ServiceOrder } from '@/types';
import { format, subDays, differenceInDays, isBefore, isAfter, isEqual, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface ExportableReportsProps {
  serviceOrders: ServiceOrder[];
  statusOptions: Array<{
    value: string;
    label: string;
    color: string;
  }>;
}

const ExportableReports = ({ serviceOrders, statusOptions }: ExportableReportsProps) => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const filteredOrders = serviceOrders.filter(order => {
    const orderDate = parseISO(order.created_at);
    return (
      (isAfter(orderDate, dateRange.from) || isEqual(orderDate, dateRange.from)) && 
      (isBefore(orderDate, dateRange.to) || isEqual(orderDate, dateRange.to))
    );
  });

  // Count orders by status within the date range
  const statusCounts = filteredOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count orders by priority within the date range
  const priorityCounts = filteredOrders.reduce((acc, order) => {
    const priorityLevel = order.priority === '1' ? 'Alta' : order.priority === '2' ? 'Média' : 'Baixa';
    acc[priorityLevel] = (acc[priorityLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const exportToExcel = () => {
    // Prepare data for export
    const data = filteredOrders.map(order => ({
      'Número OS': order.numeroos,
      'Patrimônio': order.patrimonio,
      'Equipamento': order.equipamento,
      'Status': order.status,
      'Prioridade': order.priority === '1' ? 'Alta' : order.priority === '2' ? 'Média' : 'Baixa',
      'Observação': order.observacao,
      'Data de Criação': format(parseISO(order.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ordens de Serviço');

    // Generate Excel file
    XLSX.writeFile(workbook, `ordens_de_servico_${format(dateRange.from, 'dd-MM-yyyy')}_a_${format(dateRange.to, 'dd-MM-yyyy')}.xlsx`);
    
    toast({
      title: "Relatório exportado",
      description: "O relatório Excel foi baixado com sucesso.",
      variant: "success",
    });
  };

  const printReport = () => {
    // Create a printable version of the report
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const statusLabels = statusOptions.reduce((acc, option) => {
      acc[option.value] = option.label;
      return acc;
    }, {} as Record<string, string>);

    // HTML content for the printable report
    const html = `
      <html>
        <head>
          <title>Relatório de Ordens de Serviço</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { display: flex; justify-content: space-between; align-items: center; }
            .date-range { font-size: 0.9em; color: #666; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de Ordens de Serviço</h1>
            <div class="date-range">
              Período: ${format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} a ${format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}
            </div>
          </div>
          
          <h2>Resumo</h2>
          <p>Total de ordens: ${filteredOrders.length}</p>
          <p>Período: ${differenceInDays(dateRange.to, dateRange.from) + 1} dias</p>
          
          <h3>Status</h3>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Quantidade</th>
                <th>Porcentagem</th>
              </tr>
            </thead>
            <tbody>
              ${statusOptions.map(option => `
                <tr>
                  <td>${option.label}</td>
                  <td>${statusCounts[option.value] || 0}</td>
                  <td>${filteredOrders.length ? ((statusCounts[option.value] || 0) / filteredOrders.length * 100).toFixed(1) : 0}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <h3>Prioridade</h3>
          <table>
            <thead>
              <tr>
                <th>Prioridade</th>
                <th>Quantidade</th>
                <th>Porcentagem</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alta</td>
                <td>${priorityCounts['Alta'] || 0}</td>
                <td>${filteredOrders.length ? ((priorityCounts['Alta'] || 0) / filteredOrders.length * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr>
                <td>Média</td>
                <td>${priorityCounts['Média'] || 0}</td>
                <td>${filteredOrders.length ? ((priorityCounts['Média'] || 0) / filteredOrders.length * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr>
                <td>Baixa</td>
                <td>${priorityCounts['Baixa'] || 0}</td>
                <td>${filteredOrders.length ? ((priorityCounts['Baixa'] || 0) / filteredOrders.length * 100).toFixed(1) : 0}%</td>
              </tr>
            </tbody>
          </table>
          
          <h2>Ordens de Serviço</h2>
          <table>
            <thead>
              <tr>
                <th>Número OS</th>
                <th>Patrimônio</th>
                <th>Equipamento</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Data de Criação</th>
              </tr>
            </thead>
            <tbody>
              ${filteredOrders.map(order => `
                <tr>
                  <td>${order.numeroos}</td>
                  <td>${order.patrimonio}</td>
                  <td>${order.equipamento}</td>
                  <td>${statusLabels[order.status] || order.status}</td>
                  <td>${order.priority === '1' ? 'Alta' : order.priority === '2' ? 'Média' : 'Baixa'}</td>
                  <td>${format(parseISO(order.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 30px;">
            <button onclick="window.print()">Imprimir Relatório</button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <Card className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Relatórios Exportáveis</CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              size="sm"
              className={cn(
                "w-[300px] justify-start text-left font-normal",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from && dateRange.to ? (
                <>
                  {format(dateRange.from, "d 'de' MMMM", { locale: ptBR })} - {format(dateRange.to, "d 'de' MMMM, yyyy", { locale: ptBR })}
                </>
              ) : (
                <span>Selecione um período</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange(range);
                }
              }}
              numberOfMonths={2}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Período selecionado:</span>
            <span className="font-medium">
              {differenceInDays(dateRange.to, dateRange.from) + 1} dias
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total de ordens no período:</span>
            <span className="font-medium">{filteredOrders.length}</span>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Status no período</div>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map(option => (
                <div key={option.value} className="flex justify-between text-xs">
                  <span>{option.label}:</span>
                  <span className="font-medium">{statusCounts[option.value] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          className="w-full flex items-center justify-center gap-2" 
          variant="outline"
          onClick={exportToExcel}
        >
          <FileText className="h-4 w-4" />
          Exportar Excel
        </Button>
        <Button 
          className="w-full flex items-center justify-center gap-2" 
          variant="outline" 
          onClick={printReport}
        >
          <Printer className="h-4 w-4" />
          Gerar Relatório PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExportableReports;
