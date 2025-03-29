
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import OrganizationsList from "./pages/organizations/OrganizationsList";
import NewOrganization from "./pages/organizations/NewOrganization";
import StrategicAreasList from "./pages/strategic-areas/StrategicAreasList";
import NewStrategicArea from "./pages/strategic-areas/NewStrategicArea";
import StrategyContributions from "./pages/strategy/StrategyContributions";
import StrategyObjectives from "./pages/strategy/StrategyObjectives";
import StrategyInitiatives from "./pages/strategy/StrategyInitiatives";
import StrategyPerspectives from "./pages/strategy/StrategyPerspectives";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/organizations" element={<OrganizationsList />} />
                <Route path="/organizations/new" element={<NewOrganization />} />
                <Route path="/strategic-areas" element={<StrategicAreasList />} />
                <Route path="/strategic-areas/new" element={<NewStrategicArea />} />
                
                {/* Strategy workflow routes */}
                <Route path="/strategy/contributions" element={<StrategyContributions />} />
                <Route path="/strategy/objectives" element={<StrategyObjectives />} />
                <Route path="/strategy/initiatives" element={<StrategyInitiatives />} />
                <Route path="/strategy/perspectives" element={<StrategyPerspectives />} />
                
                {/* Reports route */}
                <Route path="/reports" element={<StrategyPerspectives />} />
              </Route>
            </Route>
            
            {/* Welcome page */}
            <Route path="/welcome" element={<Index />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
