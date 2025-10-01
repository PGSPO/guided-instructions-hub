import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import IncidentDetail from "./pages/IncidentDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/incidents" element={<Index />} />
          <Route path="/incidents/:id" element={
            <AppLayout>
              <IncidentDetail />
            </AppLayout>
          } />
          <Route path="/reports" element={
            <AppLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold">Reports</h2>
                <p className="text-muted-foreground mt-2">Coming soon</p>
              </div>
            </AppLayout>
          } />
          <Route path="/settings" element={
            <AppLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-muted-foreground mt-2">Coming soon</p>
              </div>
            </AppLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
