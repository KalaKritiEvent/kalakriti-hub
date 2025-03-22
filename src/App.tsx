
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EventDetails from "./pages/events/[eventType]";
import PaymentPage from "./pages/payment/[eventType]";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import DashboardPage from "./pages/dashboard/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

// Initialize Framer Motion
import { motion, AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => {
  // Mock API setup for demonstration purposes
  useEffect(() => {
    // This would be replaced by actual API calls in a production environment
    console.log("App initialized - configuring mock API");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/events/:eventType" element={<EventDetails />} />
              <Route path="/payment/:eventType" element={<PaymentPage />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
