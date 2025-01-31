import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./components/AuthProvider";
import { ServiceOrderProvider } from "./components/ServiceOrderProvider";
import { SidebarProvider } from "./components/ui/sidebar-context";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import ADEMonitorPage from "./pages/ADEMonitor";
import DetailedServiceOrder from "./pages/DetailedServiceOrder";
import { useAuth } from "./components/AuthProvider";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Auth />;
  }

  return (
    <ServiceOrderProvider>
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
    <Route path="*" element={<Auth />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={true}
      disableTransitionOnChange
    >
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <SidebarProvider>
              <AppRoutes />
              <Toaster />
              <Sonner />
            </SidebarProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;