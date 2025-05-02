
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Search } from "lucide-react";

const Header = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  const text = "Sistema de Gerenciamento de Ordens de Serviço".split("");
  
  return (
    <div className={cn(
      "rounded-xl shadow-sm transition-all duration-300 hover:shadow-md p-4 sm:p-6",
      isLight 
        ? "bg-white border border-border/50" 
        : "bg-background/50 backdrop-blur-sm border border-border/10"
    )}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start gap-2 w-full sm:w-auto">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/3bfab654-e541-4930-a97d-6447b525b0b4.png" 
              alt="Daily.Flow Logo" 
              className="h-[45px] sm:h-[50px] w-auto object-contain"
            />
            <div className="ml-4 hidden md:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Daily.Flow
              </h1>
              <p className="text-sm text-muted-foreground">
                Gerenciamento de Ordens de Serviço
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center sm:justify-start">
            {text.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.03,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                className={cn(
                  "text-[10px] sm:text-[11px] h-[14px] flex items-center",
                  isLight ? "text-foreground/60" : "text-white"
                )}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
        </div>
        
        <div className="hidden sm:flex w-full max-w-md">
          <div className="relative flex-1 bg-secondary/80 rounded-lg overflow-hidden flex items-center px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Pesquisar ordem de serviço..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full placeholder-muted-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Don't forget to import the cn utility
import { cn } from "@/lib/utils";

export default Header;
