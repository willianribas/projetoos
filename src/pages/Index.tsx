
import Header from "@/components/Header";
import ADEMonitor from "@/components/ADEMonitor";
import ServiceOrderContent from "@/components/ServiceOrderContent";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import ADENotification from "@/components/ADENotification";
import MetricsHighlight from "@/components/charts/MetricsHighlight";
import Navbar from "@/components/Navbar";
import { NotificationProvider } from "@/contexts/NotificationContext";

const IndexContent = () => {
  const { serviceOrders } = useServiceOrders();
  
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-8 animate-fade-in">
          <ADENotification serviceOrders={serviceOrders} />
          <Header />
          <div className="px-2 sm:px-0">
            <MetricsHighlight serviceOrders={serviceOrders} />
            <ADEMonitor serviceOrders={serviceOrders} />
            <ServiceOrderContent showTableByDefault={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <ServiceOrderProvider>
        <NotificationProvider>
          <IndexContent />
        </NotificationProvider>
      </ServiceOrderProvider>
    </div>
  );
};

export default Index;
