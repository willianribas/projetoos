import Header from "@/components/Header";
import ADEMonitor from "@/components/ADEMonitor";
import ServiceOrderContent from "@/components/ServiceOrderContent";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";

const IndexContent = () => {
  const { serviceOrders } = useServiceOrders();
  
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <Header />
      <div className="px-2 sm:px-0">
        <ADEMonitor serviceOrders={serviceOrders} />
        <ServiceOrderContent />
      </div>
      <div className="text-center text-sm text-foreground/60 py-4">
        &copy; {new Date().getFullYear()} Daily.Flow. Todos os direitos reservados.
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <ServiceOrderProvider>
          <IndexContent />
        </ServiceOrderProvider>
      </div>
    </div>
  );
};

export default Index;