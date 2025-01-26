import Header from "@/components/Header";
import ADEMonitor from "@/components/ADEMonitor";
import ServiceOrderContent from "@/components/ServiceOrderContent";
import { ServiceOrderProvider } from "@/components/ServiceOrderProvider";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <ServiceOrderProvider>
        <Header />
        <ADEMonitor />
        <ServiceOrderContent />
      </ServiceOrderProvider>
    </div>
  );
};

export default Index;