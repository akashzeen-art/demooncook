import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SubscriptionProvider } from "@/lib/subscription";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import IndexEn from "./pages/IndexEn";
import Account from "./pages/Account";
import Subscribe from "./pages/Subscribe";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SubscriptionProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/account"   element={<Account />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/"   element={<SubscriptionGate><Index /></SubscriptionGate>} />
            <Route path="/fr" element={<SubscriptionGate><Index /></SubscriptionGate>} />
            <Route path="/en" element={<SubscriptionGate><IndexEn /></SubscriptionGate>} />
            <Route path="*"   element={<NotFound />} />
          </Routes>
        </SubscriptionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
