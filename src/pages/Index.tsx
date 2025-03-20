
import Header from "@/components/Header";
import ADEMonitor from "@/components/ADEMonitor";
import ServiceOrderContent from "@/components/ServiceOrderContent";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import ADENotification from "@/components/ADENotification";
import MetricsHighlight from "@/components/charts/MetricsHighlight";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

const IndexContent = () => {
  const { serviceOrders } = useServiceOrders();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 sm:space-y-6 p-4 sm:p-8"
        >
          <motion.div variants={itemVariants}>
            <ADENotification serviceOrders={serviceOrders} />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Header />
          </motion.div>
          
          <div className="px-2 sm:px-0">
            <motion.div variants={itemVariants}>
              <MetricsHighlight serviceOrders={serviceOrders} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ADEMonitor serviceOrders={serviceOrders} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ServiceOrderContent showTableByDefault={true} />
            </motion.div>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="text-center text-sm text-foreground/60 py-4"
          >
            &copy; {new Date().getFullYear()} Daily.Flow. Todos os direitos reservados.
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <ServiceOrderProvider>
        <IndexContent />
      </ServiceOrderProvider>
    </div>
  );
};

export default Index;
