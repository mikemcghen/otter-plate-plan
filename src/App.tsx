import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DevAdminSidebar } from "@/components/DevAdminSidebar";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider, useNotifications } from "@/contexts/NotificationContext";
import { OfflineBanner } from "@/components/OfflineBanner";
import { Button } from "@/components/ui/button";
import { Menu, Wrench } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import WeeklyCheckIn from "./pages/WeeklyCheckIn";
import Trends from "./pages/Trends";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import StateFlowDiagram from "./pages/StateFlowDiagram";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [devMode, setDevMode] = useState(false);
  const notifications = useNotifications();

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
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <OfflineBanner />
            <Toaster />
            <Sonner />
            <SidebarProvider defaultOpen={devMode}>
              <div className="flex min-h-screen w-full">
              {devMode && (
                <DevAdminSidebar 
                  onTriggerDailyGreeting={notifications.triggerDailyGreeting}
                  onTriggerEndOfDay={notifications.triggerEndOfDay}
                  onTriggerLevelUp={notifications.triggerLevelUp}
                  onTriggerBadgeUnlock={notifications.triggerBadgeUnlock}
                  onTriggerAchievement={notifications.triggerAchievement}
                  onTriggerSnackPicker={notifications.triggerSnackPicker}
                  onTriggerSuccessModal={notifications.triggerSuccessModal}
                  onTriggerNotificationBanner={notifications.triggerNotificationBanner}
                  onTriggerQuickLog={notifications.triggerQuickLog}
                />
              )}
              
              <div className="flex-1 flex flex-col w-full">
                <header className="h-12 flex items-center justify-between border-b border-border bg-card px-4 sticky top-0 z-50">
                  <div className="flex items-center gap-2">
                    {devMode && <SidebarTrigger />}
                    {devMode && (
                      <div className="flex items-center gap-1.5">
                        <Wrench className="w-3 h-3 text-warning" />
                        <span className="text-xs text-warning font-medium">
                          Dev Mode Active
                        </span>
                      </div>
                    )}
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
                    <Route path="/auth" element={<Auth />} />
                    <Route
                      path="/"
                      element={isOnboardingComplete ? <Dashboard /> : <Navigate to="/onboarding" replace />}
                    />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/check-in" element={<WeeklyCheckIn />} />
                    <Route path="/weekly-checkin" element={<WeeklyCheckIn />} />
                    <Route path="/trends" element={<Trends />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/state-flow" element={<StateFlowDiagram />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
);
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default App;
