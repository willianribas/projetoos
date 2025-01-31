import Header from "@/components/Header";
import ADEMonitor from "@/components/ADEMonitor";
import ServiceOrderContent from "@/components/ServiceOrderContent";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import ADENotification from "@/components/ADENotification";
import MetricsHighlight from "@/components/charts/MetricsHighlight";
import Sidebar from "@/components/Sidebar";
import { SidebarContent } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar-context";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Calendar, CheckCircle2, Clock } from "lucide-react";

const IndexContent = () => {
  const { serviceOrders } = useServiceOrders();
  
  const pendingOrders = serviceOrders.filter(order => order.status !== 'OSP').length;
  const completedOrders = serviceOrders.filter(order => order.status === 'OSP').length;
  const ordersWithDeadline = serviceOrders.filter(order => order.deadline).length;
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <SidebarContent>
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <ADENotification serviceOrders={serviceOrders} />
            <Header />
            
            <div className="px-4 sm:px-6 lg:px-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-card/50 backdrop-blur-sm border-muted hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ordens Pendentes</p>
                      <h3 className="text-2xl font-bold mt-1">{pendingOrders}</h3>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500 opacity-80" />
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-muted hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ordens Concluídas</p>
                      <h3 className="text-2xl font-bold mt-1">{completedOrders}</h3>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-500 opacity-80" />
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-muted hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Com Prazo</p>
                      <h3 className="text-2xl font-bold mt-1">{ordersWithDeadline}</h3>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-500 opacity-80" />
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-muted hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total de Ordens</p>
                      <h3 className="text-2xl font-bold mt-1">{serviceOrders.length}</h3>
                    </div>
                    <Bell className="h-8 w-8 text-purple-500 opacity-80" />
                  </CardContent>
                </Card>
              </div>

              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-6">
                  <MetricsHighlight serviceOrders={serviceOrders} />
                  <ADEMonitor serviceOrders={serviceOrders} />
                  <ServiceOrderContent showTableByDefault={true} />
                </div>
              </ScrollArea>
            </div>

            <div className="text-center text-sm text-foreground/60 py-4">
              &copy; {new Date().getFullYear()} Daily.Flow. Todos os direitos reservados.
            </div>
          </div>
        </SidebarContent>
      </div>
    </SidebarProvider>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <ServiceOrderProvider>
        <IndexContent />
      </ServiceOrderProvider>
    </div>
  );
};

export default Index;