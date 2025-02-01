import React from "react";
import NotificationBell from "./NotificationBell";
import { UserProfile } from "./UserProfile";
import { motion } from "framer-motion";

const Header = () => {
  const text = "Sistema de Gerenciamento de Ordens de Serviço".split("");
  
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-b-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start justify-between mb-1 pt-0">
        <div className="flex flex-col items-center gap-2">
          <img 
            src="/lovable-uploads/e971481a-504b-460d-aa75-ac55eb50b05a.png" 
            alt="Daily.Flow Logo" 
            className="h-20 w-auto object-contain"
          />
          <div className="flex flex-wrap justify-center">
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
        <div className="flex items-center gap-4">
          <UserProfile />
          <NotificationBell />
        </div>
      </div>
    </div>
  );
};

export default Header;