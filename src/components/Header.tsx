import React from "react";
import { Boxes, Moon, Sun } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { UserProfile } from "./UserProfile";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const text = "Sistema de Gerenciamento de Ordens de Serviço".split("");
  
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-b-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start justify-between mb-1 pt-0">
        <div className="flex items-center gap-2">
          <Boxes className="h-12 w-12 text-blue-500 self-center" />
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Daily.Flow
            </h1>
            <div className="flex flex-wrap">
              {text.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.03,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: [0.43, 0.13, 0.23, 0.96]
                  }}
                  className="text-muted-foreground text-xs"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-9 w-9 px-0"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <UserProfile />
          <NotificationBell />
        </div>
      </div>
    </div>
  );
};

export default Header;