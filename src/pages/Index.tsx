import Header from "@/components/Header";
import ADEMonitor from "@/components/ADEMonitor";
import ServiceOrderContent from "@/components/ServiceOrderContent";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import ADENotification from "@/components/ADENotification";
import MetricsHighlight from "@/components/charts/MetricsHighlight";
import Sidebar from "@/components/Sidebar";
import { SidebarContent } from "@/components/ui/sidebar";

const IndexContent = () => {
  const { serviceOrders } = useServiceOrders();
  
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <SidebarContent>
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <ADENotification serviceOrders={serviceOrders} />
          <Header />
          <div className="px-2 sm:px-0">
            <MetricsHighlight serviceOrders={serviceOrders} />
            <ADEMonitor serviceOrders={serviceOrders} />
            <ServiceOrderContent showTableByDefault={true} />
          </div>
          <div className="text-center text-sm text-foreground/60 py-4">
            &copy; {new Date().getFullYear()} Daily.Flow. Todos os direitos reservados.
          </div>
        </div>
      </SidebarContent>
    </div>
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