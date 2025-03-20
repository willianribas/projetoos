
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  BarChart2, 
  Settings, 
  LogOut, 
  Bell,
  FileText,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const NavItem = ({
  icon: Icon,
  title,
  isActive,
  onClick,
}: {
  icon: any;
  title: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
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
          : "text-muted-foreground hover:text-foreground",
        isHovered ? "w-auto px-4" : "w-12"
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn(
          "h-5 w-5 transition-colors duration-300",
          isActive ? "text-primary" : "text-muted-foreground",
          "group-hover:text-primary"
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
          className="absolute bottom-0 left-0 h-1 w-full bg-primary rounded-t-full"
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

const MobileMenu = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-card border-l border-border shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <p className="font-semibold text-gradient">Menu</p>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      title: "Estatísticas",
      icon: BarChart2,
      path: "/statistics",
    },
    {
      title: "Configurações",
      icon: Settings,
      path: "/settings",
    },
    {
      title: "Sair",
      icon: LogOut,
      path: "/logout",
      action: signOut
    },
  ];

  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-b border-border/40">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/3bfab654-e541-4930-a97d-6447b525b0b4.png" 
                alt="Daily.Flow Logo" 
                className="h-8 w-auto"
              />
              <p className="text-sm text-gradient font-medium">Daily.Flow</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(true)}
              className="text-muted-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          <div className="flex flex-col space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.title}
                variant={location.pathname === item.path ? "default" : "ghost"}
                className="justify-start w-full py-6"
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    navigate(item.path);
                  }
                  setMobileMenuOpen(false);
                }}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Button>
            ))}
          </div>
        </MobileMenu>
      </>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-card/30 backdrop-blur-md border-b border-border/40">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2 ml-0">
          {menuItems.slice(0, 4).map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              title={item.title}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>

        <div className="flex items-center space-x-2">
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
