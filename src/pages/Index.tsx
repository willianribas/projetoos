import Header from "@/components/Header";
import ADEMonitor from "@/components/ADEMonitor";
import ServiceOrderContent from "@/components/ServiceOrderContent";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";

const IndexContent = () => {
  const { serviceOrders } = useServiceOrders();
  
  return (
    <>
      <Header />
      <ADEMonitor serviceOrders={serviceOrders} />
      <ServiceOrderContent />
    </>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <ServiceOrderProvider>
        <IndexContent />
      </ServiceOrderProvider>
    </div>
  );
};

export default Index;