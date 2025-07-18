import React from "react";
import { Menu, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import NotificationBell from "@/components/NotificationBell";
import { UserProfile } from "@/components/UserProfile";

interface ModernHeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const ModernHeader = ({ onToggleSidebar, sidebarOpen }: ModernHeaderProps) => {
  return (
    <header className={cn(
      "fixed top-0 right-0 h-16 bg-card/95 backdrop-blur-md border-b border-border z-30 transition-all duration-300",
      sidebarOpen ? "left-72" : "left-16"
    )}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="hidden lg:flex text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          {/* Search Bar */}
          <div className="relative w-64 lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar ordens de serviço..."
              className="pl-10 bg-muted/50 border-0 focus:bg-background transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Sistema Online
            </Badge>
          </div>

          {/* Notifications */}
          <NotificationBell />

          {/* User Profile */}
          <UserProfile />
        </div>
      </div>
    </header>
  );
};