import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./components/AuthProvider";
import { SidebarProvider } from "./components/ui/sidebar-context";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import ADEMonitorPage from "./pages/ADEMonitor";
import { useAuth } from "./components/AuthProvider";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Auth />;
  }

  return <>{children}</>;
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
    <Route path="*" element={<Auth />} />
  </Routes>
);

const App = () => (
  <ThemeProvider defaultTheme="dark" attribute="class">
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;