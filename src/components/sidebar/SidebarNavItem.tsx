import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarNavItemProps {
  icon: LucideIcon;
  title: string;
  isActive?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
}

export function SidebarNavItem({
  icon: Icon,
  title,
  isActive,
  isOpen,
  onClick,
}: SidebarNavItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-4",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-7">
        <Icon className="h-5 w-5" />
      </div>
      <span
        className={cn(
          "transition-all duration-300 opacity-0 overflow-hidden",
          isOpen && "opacity-100"
        )}
      >
        {title}
      </span>
    </Button>
  );
}