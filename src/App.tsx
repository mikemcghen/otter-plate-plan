import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DevAdminSidebar } from "@/components/DevAdminSidebar";
import { AppProvider } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import WeeklyCheckIn from "./pages/WeeklyCheckIn";
import Trends from "./pages/Trends";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    const onboardingComplete = localStorage.getItem("ottrcal_onboarding_complete");
    setIsOnboardingComplete(onboardingComplete === "true");
    
    // Check if dev mode is enabled
    const devModeEnabled = localStorage.getItem("ottrcal_dev_mode");
    setDevMode(devModeEnabled === "true");
  }, []);

  const toggleDevMode = () => {
    const newDevMode = !devMode;
    setDevMode(newDevMode);
    localStorage.setItem("ottrcal_dev_mode", newDevMode.toString());
  };

  if (isOnboardingComplete === null) {
    return null; // Loading state
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider defaultOpen={devMode}>
              <div className="flex min-h-screen w-full">
              {devMode && <DevAdminSidebar />}
              
              <div className="flex-1 flex flex-col w-full">
                {/* Dev Mode Toggle Button */}
                <header className="h-12 flex items-center justify-between border-b border-border bg-card px-4 sticky top-0 z-50">
                  <div className="flex items-center gap-2">
                    {devMode && <SidebarTrigger />}
                    <span className="text-xs text-muted-foreground">
                      {devMode ? "🛠️ Dev Mode Active" : ""}
                    </span>
                  </div>
                  <Button
                    variant={devMode ? "default" : "outline"}
                    size="sm"
                    onClick={toggleDevMode}
                    className="text-xs h-8"
                  >
                    <Menu className="w-4 h-4 mr-1" />
                    {devMode ? "Hide" : "Show"} Dev Nav
                  </Button>
                </header>

                <main className="flex-1">
                  <Routes>
                    <Route
                      path="/"
                      element={isOnboardingComplete ? <Dashboard /> : <Navigate to="/onboarding" replace />}
                    />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/check-in" element={<WeeklyCheckIn />} />
                    <Route path="/weekly-checkin" element={<WeeklyCheckIn />} />
                    <Route path="/trends" element={<Trends />} />
                    <Route path="/settings" element={<Settings />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
