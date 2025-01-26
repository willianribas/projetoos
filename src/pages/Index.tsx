import Header from "@/components/Header";
import ADEMonitor from "@/components/ADEMonitor";
import ServiceOrderContent from "@/components/ServiceOrderContent";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";

const IndexContent = () => {
  const { serviceOrders } = useServiceOrders();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Header />
      <ADEMonitor serviceOrders={serviceOrders} />
      <ServiceOrderContent />
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-8">
      <div className="max-w-7xl mx-auto">
        <ServiceOrderProvider>
          <IndexContent />
        </ServiceOrderProvider>
      </div>
    </div>
  );
};

export default Index;