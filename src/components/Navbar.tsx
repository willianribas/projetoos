
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  FileText, 
  Bell, 
  ActivitySquare, 
  BarChart2,
  Settings, 
  LogOut, 
  Search,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile } from "./UserProfile";
import NotificationBell from "./NotificationBell";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobileDetect } from "@/hooks/use-mobile";

interface NavItemProps {
  icon: React.ElementType;
  title: string;
  isActive: boolean;
  onClick: () => void;
  isMobile?: boolean;
}

const NavItem = ({
  icon: Icon,
  title,
  isActive,
  onClick,
  isMobile = false
}: NavItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  if (isMobile) {
    return (
      <Button
        onClick={onClick}
        variant="ghost"
        className={cn(
          "w-full justify-start px-4 py-2 h-12",
          isActive ? "bg-primary/10 text-primary" : "text-foreground/70"
        )}
      >
        <Icon className={cn("h-5 w-5 mr-3", isActive ? "text-primary" : "text-foreground/70")} />
        {title}
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      variant="ghost"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative h-12 transition-all duration-300 group",
        isActive 
          ? "bg-primary/10 text-primary"
          : "hover:bg-primary/5 text-foreground/70",
        isHovered ? "w-auto px-4" : "w-12"
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn(
          "h-5 w-5 transition-colors duration-300",
          isActive ? "text-primary" : "text-foreground/70",
        )} />
        <AnimatePresence>
          {isHovered && (
            <motion.span 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap overflow-hidden"
            >
              {title}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      )}
    </Button>
  );
};

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      title: "Início",
      icon: Home,
      path: "/",
    },
    {
      title: "OS Detalhada",
      icon: FileText,
      path: "/detailed-service-order",
    },
    {
      title: "AM/ADE Detalhada",
      icon: Bell,
      path: "/ade-monitor",
    },
    {
      title: "Analisadores",
      icon: ActivitySquare,
      path: "/analyzers",
    },
    {
      title: "Estatísticas",
      icon: BarChart2,
      path: "/statistics",
    },
    {
      title: "Configurações",
      icon: Settings,
      path: "/settings",
    }
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/3bfab654-e541-4930-a97d-6447b525b0b4.png" 
              alt="Daily.Flow Logo" 
              className="h-8 w-auto mr-2"
            />
            <span className="font-semibold text-lg">Daily.Flow</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              title={item.title}
              isActive={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setOpen(false);
              }}
              isMobile
            />
          ))}
        </div>
        <div className="mt-auto pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2 h-12 text-destructive hover:bg-destructive/10"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sair
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { isMobile } = useMobileDetect();

  const menuItems = [
    {
      title: "Início",
      icon: Home,
      path: "/",
    },
    {
      title: "OS Detalhada",
      icon: FileText,
      path: "/detailed-service-order",
    },
    {
      title: "AM/ADE Detalhada",
      icon: Bell,
      path: "/ade-monitor",
    },
    {
      title: "Analisadores",
      icon: ActivitySquare,
      path: "/analyzers",
    },
    {
      title: "Estatísticas",
      icon: BarChart2,
      path: "/statistics",
    },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-1">
          <MobileNav />
          <div className="hidden md:flex">
            {menuItems.map((item) => (
              <NavItem
                key={item.title}
                icon={item.icon}
                title={item.title}
                isActive={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative rounded-full bg-secondary/80 flex items-center px-2 py-1 mr-2 hidden md:flex">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              className="bg-transparent border-none focus:outline-none text-sm w-32 placeholder-muted-foreground"
            />
          </div>
          <UserProfile />
          <NotificationBell />
          <NavItem
            icon={Settings}
            title="Configurações"
            isActive={location.pathname === "/settings"}
            onClick={() => navigate("/settings")}
          />
          <NavItem
            icon={LogOut}
            title="Sair"
            isActive={false}
            onClick={signOut}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
