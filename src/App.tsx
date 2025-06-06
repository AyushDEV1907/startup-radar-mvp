
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import RequireAuth from "./components/RequireAuth";
import InvestorRoutes from "./components/InvestorRoutes";
import FounderRoutes from "./components/FounderRoutes";
import Pricing from "./pages/Pricing";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";
import ScoreTester from "./ScoreTester";

const queryClient = new QueryClient();

const App = () => (
  <SessionContextProvider supabaseClient={supabase}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/investor/*" element={
              <RequireAuth>
                <InvestorRoutes />
              </RequireAuth>
            } />
            <Route path="/founder/*" element={
              <RequireAuth>
                <FounderRoutes />
              </RequireAuth>
            } />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/success" element={<Success />} />
            <Route path="/score-tester" element={<ScoreTester />} />
            {/* Legacy redirects for backward compatibility */}
            <Route path="/investor-onboard" element={<Auth />} />
            <Route path="/investor-signup" element={<Auth />} />
            <Route path="/startup/signup" element={<Auth />} />
            <Route path="/startup/login" element={<Auth />} />
            <Route path="/investor-dashboard" element={
              <RequireAuth>
                <InvestorRoutes />
              </RequireAuth>
            } />
            <Route path="/startup/dashboard" element={
              <RequireAuth>
                <FounderRoutes />
              </RequireAuth>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </SessionContextProvider>
);

export default App;
