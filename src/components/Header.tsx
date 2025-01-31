import React from "react";
import { Boxes } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { UserProfile } from "./UserProfile";
import { motion } from "framer-motion";

const Header = () => {
  const text = "Sistema de Gerenciamento de Ordens de Serviço".split("");
  
  return (
    <div className="mb-6 p-4 bg-card/50 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 pl-2">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Boxes className="h-6 w-6 text-blue-500" />
          </div>
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
          <UserProfile />
          <NotificationBell />
        </div>
      </div>
    </div>
  );
};

export default Header;