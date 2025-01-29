import React from "react";
import { Menu, X, BarChart2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Statistics from "@/components/Statistics";
import { SettingsPanel } from "@/components/quick-actions/SettingsPanel";
import { ServiceOrder } from "@/types";

interface SidebarProps {
  serviceOrders: ServiceOrder[];
}

export const Sidebar = ({ serviceOrders }: SidebarProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<"statistics" | "settings" | null>(null);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div
        ref={sidebarRef}
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transform transition-transform duration-300 ease-in-out z-40",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setActiveSection(activeSection === "statistics" ? null : "statistics")}
          >
            <BarChart2 className="h-5 w-5 mr-2" />
            Estatísticas
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setActiveSection(activeSection === "settings" ? null : "settings")}
          >
            <Settings className="h-5 w-5 mr-2" />
            Configurações
          </Button>
        </div>

        <div className="p-4">
          {activeSection === "statistics" && <Statistics serviceOrders={serviceOrders} statusOptions={[]} />}
          {activeSection === "settings" && (
            <SettingsPanel showSettings={true} serviceOrders={serviceOrders} />
          )}
        </div>
      </div>
    </>
  );
};