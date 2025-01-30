import { useServiceOrders } from "@/components/ServiceOrderProvider";
import { ServiceOrder } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, AlertCircle, ShoppingCart } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { SidebarContent } from "@/components/ui/sidebar";
import Header from "@/components/Header";

const getColorByDays = (days: number): string => {
  if (days <= 3) return "text-[#0EA5E9]"; // Verde/Azul para 0-3 dias
  if (days <= 6) return "text-[#F97316]"; // Laranja para 4-6 dias
  return "text-[#ea384c]"; // Vermelho para 7+ dias
};

const StatusMonitor = ({ 
  orders, 
  title, 
  icon: Icon, 
  iconColor 
}: { 
  orders: ServiceOrder[], 
  title: string, 
  icon: React.ElementType,
  iconColor: string 
}) => {
  const calculateDays = (createdAt: string) => {
    return Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <Card className="border-muted bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {title}
          </span>
        </CardTitle>
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          <span>{orders.length} OS em {title.split(" ").pop()}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">Número OS</TableHead>
              <TableHead className="w-[120px]">Patrimônio</TableHead>
              <TableHead className="w-[200px]">Equipamento</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead className="w-[150px]">Adicionado em</TableHead>
              <TableHead className="w-[120px] text-right">Tempo em {title.split(" ").pop()}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => {
              const days = calculateDays(order.created_at);
              const colorClass = getColorByDays(days);
              
              return (
                <TableRow 
                  key={index}
                  className="hover:bg-primary/5 transition-colors duration-200"
                >
                  <TableCell className="font-medium">{order.numeroos}</TableCell>
                  <TableCell>{order.patrimonio}</TableCell>
                  <TableCell>{order.equipamento}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {order.observacao}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(order.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${colorClass}`}>
                    {days} DIAS
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const ADEMonitorPage = () => {
  const { serviceOrders } = useServiceOrders();
  const adeOrders = serviceOrders.filter(order => order.status === "ADE");
  const amOrders = serviceOrders.filter(order => order.status === "A.M");

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <SidebarContent>
        <div className="p-6 space-y-6 animate-fade-in">
          <Header />
          <div className="space-y-6">
            <StatusMonitor 
              orders={adeOrders} 
              title="Monitor de ADE" 
              icon={Clock} 
              iconColor="text-blue-400" 
            />
            <StatusMonitor 
              orders={amOrders} 
              title="Monitor de A.M" 
              icon={ShoppingCart} 
              iconColor="text-[#ea384c]" 
            />
          </div>
        </div>
      </SidebarContent>
    </div>
  );
};

export default ADEMonitorPage;