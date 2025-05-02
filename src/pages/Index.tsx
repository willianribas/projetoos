
import React, { useState } from "react";
import Header from "@/components/Header";
import ADEMonitor from "@/components/ADEMonitor";
import ServiceOrderContent from "@/components/ServiceOrderContent";
import { ServiceOrderProvider, useServiceOrders } from "@/components/ServiceOrderProvider";
import ADENotification from "@/components/ADENotification";
import MetricsHighlight from "@/components/charts/MetricsHighlight";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, ClipboardList, BarChart2, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IndexContent = () => {
  const { serviceOrders, isLoading } = useServiceOrders();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-20 pb-10">
        <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
          <Header />
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <ADENotification serviceOrders={serviceOrders} />
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="px-1 sm:px-0"
              >
                <motion.div variants={itemVariants}>
                  <MetricsHighlight serviceOrders={serviceOrders} />
                </motion.div>

                <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="mt-8">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="dashboard" className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </TabsTrigger>
                    <TabsTrigger value="monitor" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span className="hidden sm:inline">Notificações</span>
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Ordens de Serviço</span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="dashboard" className="space-y-6">
                    <motion.div
                      variants={itemVariants}
                      className="grid grid-cols-1 gap-4 lg:grid-cols-12"
                    >
                      <Card className="col-span-1 lg:col-span-8 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle>Visão Geral das Ordens de Serviço</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ServiceOrderContent showTableByDefault={true} />
                        </CardContent>
                      </Card>
                      <Card className="col-span-1 lg:col-span-4 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle>Notificações</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ADEMonitor serviceOrders={serviceOrders} />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                  
                  <TabsContent value="monitor">
                    <motion.div variants={itemVariants}>
                      <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle>Notificações Detalhadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ADEMonitor serviceOrders={serviceOrders} />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                  
                  <TabsContent value="orders">
                    <motion.div variants={itemVariants}>
                      <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle>Gerenciamento de Ordens de Serviço</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ServiceOrderContent showTableByDefault={true} />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ServiceOrderProvider>
        <IndexContent />
      </ServiceOrderProvider>
    </div>
  );
};

export default Index;
