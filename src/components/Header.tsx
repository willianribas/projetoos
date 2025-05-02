
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const Header = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  return (
    <div className={cn(
      "rounded-xl shadow-sm transition-all duration-300 hover:shadow-md p-4 sm:p-6",
      isLight 
        ? "bg-white border border-border/50" 
        : "bg-background/50 backdrop-blur-sm border border-border/10"
    )}>
      <div className="flex items-center justify-center">
        <img 
          src="/lovable-uploads/3bfab654-e541-4930-a97d-6447b525b0b4.png" 
          alt="Logo" 
          className="h-[45px] sm:h-[50px] w-auto object-contain"
        />
      </div>
    </div>
  );
};

// Don't forget to import the cn utility
import { cn } from "@/lib/utils";

export default Header;
