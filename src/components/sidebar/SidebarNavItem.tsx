import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  icon: LucideIcon;
  title: string;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
}

export const SidebarNavItem = ({
  icon: Icon,
  title,
  isActive,
  isOpen,
  onClick,
}: SidebarNavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center px-4 py-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
        isActive && "text-sidebar-foreground bg-sidebar-accent"
      )}
    >
      <Icon className="h-5 w-5" />
      {isOpen && <span className="ml-4">{title}</span>}
    </button>
  );
};