
import React from "react";
import Navbar from "../Navbar";
import { motion } from "framer-motion";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-10">
        <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
          {title && (
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold"
            >
              {title}
            </motion.h1>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {children}
          </motion.div>
          
          <div className="text-center text-sm text-foreground/60 pt-6">
            &copy; {new Date().getFullYear()} Daily.Flow. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
