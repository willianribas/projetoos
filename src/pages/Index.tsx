
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import ADEMonitor from "@/components/ADEMonitor";
import ServiceOrderContent from "@/components/ServiceOrderContent";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import ADENotification from "@/components/ADENotification";
import RemindersSection from "@/components/reminders/RemindersSection";
import { SharedServiceOrders } from "@/components/SharedServiceOrders";

const IndexContent = () => {
  const { serviceOrders } = useServiceOrders();
  
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Notification */}
        <ADENotification serviceOrders={serviceOrders} />
        
        {/* Dashboard Cards */}
        <DashboardCards serviceOrders={serviceOrders} />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-2 space-y-6">
            <ServiceOrderContent showTableByDefault={true} />
            <ADEMonitor serviceOrders={serviceOrders} />
          </div>
          
          {/* Right Column - Sidebar Content */}
          <div className="space-y-6">
            <SharedServiceOrders />
            <RemindersSection />
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-8 border-t border-border">
          &copy; {new Date().getFullYear()} Daily.Flow. Todos os direitos reservados.
        </div>
      </div>
    </DashboardLayout>
  );
};

const Index = () => {
  return (
    <ServiceOrderProvider>
      <IndexContent />
    </ServiceOrderProvider>
  );
};

export default Index;
