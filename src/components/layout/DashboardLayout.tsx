import React, { useState } from "react";
import { ModernSidebar } from "./ModernSidebar";
import { ModernHeader } from "./ModernHeader";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen gradient-background">
      <ModernSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <ModernHeader onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      {/* Main Content */}
      <main className={cn(
        "pt-16 transition-all duration-300 min-h-screen",
        sidebarOpen ? "lg:ml-72" : "lg:ml-16"
      )}>
        <div className="content-container py-6">
          {children}
        </div>
      </main>
    </div>
  );
};