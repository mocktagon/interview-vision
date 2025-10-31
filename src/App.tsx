import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Lists from "./pages/Lists";
import SwipeView from "./pages/SwipeView";
import ManageInterviews from "./pages/ManageInterviews";
import SwipeInterviews from "./pages/SwipeInterviews";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Lists />} />
          <Route path="/interviews" element={<ManageInterviews />} />
          <Route path="/list/:listId" element={<Index />} />
          <Route path="/swipe/:listId" element={<SwipeView />} />
          <Route path="/swipe-interviews/:listId" element={<SwipeInterviews />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
