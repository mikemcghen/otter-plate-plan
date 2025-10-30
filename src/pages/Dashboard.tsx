import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DailyFocus } from "@/components/DailyFocus";
import { AmbientBackground } from "@/components/AmbientBackground";
import { OtterMascot } from "@/components/OtterMascot";
import type { OtterMood } from "@/components/OtterMascot";
import { useAppContext } from "@/contexts/AppContext";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { PullToRefresh } from "@/components/PullToRefresh";
import { QuickLogPanel } from "@/components/QuickLogPanel";
import { Flame, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/useHaptics";

const Dashboard = () => {
  const { user } = useAuth();
  const { impact } = useHaptics();
  const appContext = useAppContext();
  const {
    caloriesConsumed,
    caloriesTarget,
    level,
    streak,
    logFood,
  } = appContext;

  const [showQuickLog, setShowQuickLog] = useState(false);
  const [userName, setUserName] = useState("Friend");
  const [focusCompleted, setFocusCompleted] = useState(false);
  const [showWaterRipple, setShowWaterRipple] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState<string | null>(null);

  // Load user profile
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setUserName(data.display_name || "Friend");
    }
  };

  // Get time of day for environment
  const getTimeOfDay = (): "morning" | "afternoon" | "evening" | "night" => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  };

  const timeOfDay = getTimeOfDay();

  // Show Ottr greeting on mount
  useEffect(() => {
    const greetings = {
      morning: `Good morning, ${userName}! Let's start the day gently 🌿`,
      afternoon: `The tide feels calm today, ${userName} 💜`,
      evening: `Evening, ${userName}! Time to wind down 🌙`,
      night: `Rest peacefully, ${userName} 🌙`,
    };
    
    setTimeout(() => {
      setGreetingMessage(greetings[timeOfDay]);
    }, 1500);
  }, [timeOfDay, userName]);

  // Focus completion handler
  const handleFocusComplete = () => {
    setFocusCompleted(true);
    setShowWaterRipple(true);
    
    // Show completion message
    setTimeout(() => {
      setGreetingMessage("You did it — the cove feels peaceful again 💜🌊");
    }, 800);
    
    // Hide ripple effect
    setTimeout(() => {
      setShowWaterRipple(false);
    }, 3000);
    
    toast({
      title: "Daily Focus Complete! 🌊",
      description: "The cove feels peaceful again",
    });
  };

  const caloriePercentage = (caloriesConsumed / caloriesTarget) * 100;

  // Dynamic otter mood based on time of day and completion
  const getOtterState = (): { mood: OtterMood } => {
    if (focusCompleted && timeOfDay === "night") {
      return { mood: "sleepy" };
    }
    if (focusCompleted) {
      return { mood: "proud" };
    }
    if (timeOfDay === "morning") {
      return { mood: "happy" };
    }
    if (timeOfDay === "evening" || timeOfDay === "night") {
      return { mood: "sleepy" };
    }
    return { mood: "encouraging" };
  };

  const otterState = getOtterState();

  const handleQuickLog = async () => {
    await impact();
    setShowQuickLog(true);
  };

  const handleQuickLogFood = async (food: any) => {
    logFood({
      name: food.name,
      calories: food.calories,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
    });
    
    toast({
      title: "Food logged! 🌊",
      description: `${food.name} added • +15 XP`,
    });
  };

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Refreshed!",
      description: "Your data is up to date",
    });
  };

  return (
    <div className="min-h-screen relative pb-24 overflow-hidden">
      {/* Environment Layer - Ambient background */}
      <AmbientBackground timeOfDay={timeOfDay} progressPercentage={caloriePercentage} />
      
      {/* Water ripple completion effect */}
      {showWaterRipple && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-primary/5 animate-[ripple-expand_3s_ease-out]" 
            style={{
              background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
              animation: "ripple-expand 3s ease-out forwards",
            }}
          />
        </div>
      )}

      {/* Quick Log Panel */}
      <QuickLogPanel
        open={showQuickLog}
        onOpenChange={setShowQuickLog}
        onLog={handleQuickLogFood}
      />

      <PullToRefresh onRefresh={handleRefresh}>
        {/* Interface Layer - Minimal Header with Icon Indicators */}
        <header className="absolute top-0 left-0 right-0 z-40 px-6 py-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            {/* Tiny XP indicator */}
            <div className="flex items-center gap-2 bg-card/40 backdrop-blur-md rounded-full px-3 py-1.5 border border-border/30">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground/80">Lv.{level}</span>
            </div>
            
            {/* Tiny Streak indicator */}
            <div className="flex items-center gap-2 bg-card/40 backdrop-blur-md rounded-full px-3 py-1.5 border border-border/30">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-medium text-foreground/80">{streak}</span>
            </div>
          </div>
        </header>

        {/* Character Layer - Ottr Mascot centered in scene */}
        <main className="relative max-w-md mx-auto px-6 pt-24 pb-8 space-y-8">
          
          {/* Greeting bubble from Ottr */}
          {greetingMessage && (
            <div className="text-center animate-fade-in">
              <p className="text-sm font-medium text-foreground/70 px-4">
                {greetingMessage}
              </p>
            </div>
          )}
          
          {/* Ottr Mascot (Living companion) - centered */}
          <div className="flex justify-center items-center min-h-[240px] transition-all duration-[3000ms]">
            <OtterMascot 
              mood={otterState.mood}
              animate={true}
            />
          </div>

          {/* Interface Layer - Daily Focus Bubble */}
          {!focusCompleted && (
            <div className="animate-fade-in">
              <DailyFocus onComplete={handleFocusComplete} />
            </div>
          )}

          {/* Completion Message */}
          {focusCompleted && (
            <div className="text-center space-y-2 animate-fade-in">
              <p className="text-lg font-medium text-foreground/90">
                Ottr is resting peacefully
              </p>
              <p className="text-sm text-muted-foreground">
                You've earned it 🌙
              </p>
            </div>
          )}

        </main>
      </PullToRefresh>

      {/* Interface Layer - Floating Action Button (handled by MobileBottomNav) */}
      <MobileBottomNav onQuickLog={handleQuickLog} />
    </div>
  );
};

export default Dashboard;
