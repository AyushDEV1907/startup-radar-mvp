
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InvestorOnboard from "./pages/InvestorOnboard";
import InvestorCalibrate from "./pages/InvestorCalibrate";
import InvestorDashboard from "./pages/InvestorDashboard";
import InvestorSignup from "./pages/InvestorSignup";
import InvestorPreferences from "./pages/InvestorPreferences";
import InvestorSeedTest from "./pages/InvestorSeedTest";
import Startups from "./pages/Startups";
import StartupDetail from "./pages/StartupDetail";
import NotFound from "./pages/NotFound";
import ScoreTester from "./ScoreTester";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/investor-onboard" element={<InvestorOnboard />} />
          <Route path="/investor-calibrate" element={<InvestorCalibrate />} />
          <Route path="/investor-dashboard" element={<InvestorDashboard />} />
          <Route path="/investor-signup" element={<InvestorSignup />} />
          <Route path="/investor/preferences" element={<InvestorPreferences />} />
          <Route path="/investor/seed-test" element={<InvestorSeedTest />} />
          <Route path="/startups" element={<Startups />} />
          <Route path="/startups/:id" element={<StartupDetail />} />
          <Route path="/score-tester" element={<ScoreTester />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
