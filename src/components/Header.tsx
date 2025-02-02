import React from "react";
import NotificationBell from "./NotificationBell";
import { UserProfile } from "./UserProfile";
import { motion } from "framer-motion";

const Header = () => {
  const text = "Sistema de Gerenciamento de Ordens de Serviço".split("");
  
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-b-xl shadow-lg transition-all duration-300 hover:shadow-xl p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start gap-2 w-full sm:w-auto">
          <img 
            src="/lovable-uploads/3bfab654-e541-4930-a97d-6447b525b0b4.png" 
            alt="Daily.Flow Logo" 
            className="h-[45px] sm:h-[45px] w-auto object-contain"
          />
          <div className="flex flex-wrap justify-center sm:justify-start">
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
                  className="text-muted-foreground text-[9px] sm:text-[10px] h-[1px] flex items-center"
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
