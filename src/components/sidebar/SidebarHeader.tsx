import React from "react";
import { Menu } from "lucide-react";

interface SidebarHeaderProps {
  isOpen: boolean;
}

export const SidebarHeader = ({ isOpen }: SidebarHeaderProps) => {
  return (
    <div className="p-4 flex items-center gap-3">
      <Menu className="h-6 w-6 text-sidebar-foreground/60" />
      {isOpen && (
        <span className="text-white font-semibold text-lg">Daily.Flow</span>
      )}
    </div>
  );
};