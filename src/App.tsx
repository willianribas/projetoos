
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./components/AuthProvider";
import { ServiceOrderProvider } from "./components/ServiceOrderProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import ADEMonitorPage from "./pages/ADEMonitor";
import DetailedServiceOrder from "./pages/DetailedServiceOrder";
import AnalyzersPage from "./pages/Analyzers";
import Calendar from "./pages/Calendar";
import { useAuth } from "./components/AuthProvider";
import { useEffect } from "react";
import { useServiceOrders } from "./components/ServiceOrderProvider";
import { useToast } from "./hooks/use-toast";

const queryClient = new QueryClient();

const KeyboardShortcuts = () => {
  const { lastDeletedServiceOrder, undoDeletedServiceOrder } = useAuth();
  const { serviceOrders, restoreServiceOrder } = useServiceOrders();
  const { toast } = useToast();
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Z to undo deletion
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        
        // Check if there's a recently deleted order
        if (lastDeletedServiceOrder.id && lastDeletedServiceOrder.timestamp) {
          // Check if deletion was recent (within 30 seconds)
          const now = Date.now();
          const timeDifference = now - lastDeletedServiceOrder.timestamp;
          
          if (timeDifference <= 30000) {
            restoreServiceOrder(lastDeletedServiceOrder.id);
            toast({
              title: "Ação desfeita",
              description: "Ordem de serviço restaurada com sucesso",
              variant: "default",
            });
          } else {
            toast({
              title: "Não foi possível desfazer",
              description: "Tempo limite para desfazer expirado (30 segundos)",
              variant: "default",
            });
          }
        } else {
          toast({
            title: "Nada para desfazer",
            description: "Não há ações recentes para desfazer",
            variant: "default",
          });
        }
      }
      
      // Add more keyboard shortcuts as needed
      // F1 or ? to show help
      if (event.key === 'F1' || event.key === '?') {
        event.preventDefault();
        toast({
          title: "Atalhos de teclado disponíveis",
          description: "Ctrl+Z: Desfazer exclusão • F1/?: Mostrar ajuda • Esc: Fechar diálogos",
          variant: "default",
          duration: 5000,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lastDeletedServiceOrder, restoreServiceOrder, toast]);

  return null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Auth />;
  }

  return (
    <ServiceOrderProvider>
      <KeyboardShortcuts />
      {children}
    </ServiceOrderProvider>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<Auth />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      }
    />
    <Route
      path="/statistics"
      element={
        <ProtectedRoute>
          <Statistics />
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      }
    />
    <Route
      path="/ade-monitor"
      element={
        <ProtectedRoute>
          <ADEMonitorPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/detailed-service-order"
      element={
        <ProtectedRoute>
          <DetailedServiceOrder />
        </ProtectedRoute>
      }
    />
    <Route
      path="/analyzers"
      element={
        <ProtectedRoute>
          <AnalyzersPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/calendar"
      element={
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Auth />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
