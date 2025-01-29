import React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "../sidebar-context";

interface SidebarBaseProps {
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function SidebarBase({ children, className, onMouseEnter, onMouseLeave }: SidebarBaseProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen">
      <div
        className={cn(
          "fixed left-0 top-0 h-full z-40 transition-all duration-300 bg-background border-r border-border",
          isOpen ? "w-64" : "w-16",
          className
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="h-full flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}