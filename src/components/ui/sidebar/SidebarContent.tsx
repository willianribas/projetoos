import React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "../sidebar-context";

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarContent({ children, className }: SidebarContentProps) {
  const { isOpen } = useSidebar();

  return (
    <div
      className={cn(
        "flex-1 transition-all duration-300",
        isOpen ? "ml-64" : "ml-16",
        className
      )}
    >
      <div className="p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}