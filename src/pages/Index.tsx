import Header from "@/components/Header";
import ADEMonitor from "@/components/ADEMonitor";
import ServiceOrderContent from "@/components/ServiceOrderContent";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import ADENotification from "@/components/ADENotification";
import MetricsHighlight from "@/components/charts/MetricsHighlight";
import Navbar from "@/components/Navbar";
import RemindersSection from "@/components/reminders/RemindersSection";
const IndexContent = () => {
  const {
    serviceOrders
  } = useServiceOrders();
  return <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-8 animate-fade-in bg-zinc-900">
          <ADENotification serviceOrders={serviceOrders} />
          <Header />
          <div className="px-2 sm:px-0">
            <MetricsHighlight serviceOrders={serviceOrders} />
            <RemindersSection />
            <ADEMonitor serviceOrders={serviceOrders} />
            <ServiceOrderContent showTableByDefault={true} />
          </div>
          <div className="text-center text-sm text-foreground/60 py-4">
            &copy; {new Date().getFullYear()} Daily.Flow. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </div>;
};
const Index = () => {
  return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ServiceOrderProvider>
        <IndexContent />
      </ServiceOrderProvider>
    </div>;
};
export default Index;