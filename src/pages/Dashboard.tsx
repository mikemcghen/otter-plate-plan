import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AmbientBackground } from "@/components/AmbientBackground";
import { OtterMascot } from "@/components/OtterMascot";
import type { OtterMood } from "@/components/OtterMascot";
import { useAppContext } from "@/contexts/AppContext";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { PullToRefresh } from "@/components/PullToRefresh";
import { QuickLogPanel } from "@/components/QuickLogPanel";
import { CircularProgress } from "@/components/CircularProgress";
import { MacroRing } from "@/components/MacroRing";
import { Droplet, Apple, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

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
  const [showWaterRipple, setShowWaterRipple] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState<string | null>(null);
  const [subGreeting, setSubGreeting] = useState<string | null>(null);
  
  // Micro-quest states
  const [hydrationComplete, setHydrationComplete] = useState(false);
  const [snackComplete, setSnackComplete] = useState(false);
  const [reflectionComplete, setReflectionComplete] = useState(false);

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
      morning: { main: `Good morning, ${userName} ☀️`, sub: "The tide feels balanced today." },
      afternoon: { main: `Good afternoon, ${userName}`, sub: "The cove is peaceful and calm." },
      evening: { main: `Evening, ${userName} 🌙`, sub: "Time to wind down gently." },
      night: { main: `Rest well, ${userName}`, sub: "The stars are watching over you." },
    };
    
    setTimeout(() => {
      setGreetingMessage(greetings[timeOfDay].main);
      setSubGreeting(greetings[timeOfDay].sub);
    }, 1500);
  }, [timeOfDay, userName]);

  const caloriePercentage = (caloriesConsumed / caloriesTarget) * 100;
  const proteinPercentage = (appContext.proteinConsumed / appContext.proteinTarget) * 100;
  const carbsPercentage = (appContext.carbsConsumed / appContext.carbsTarget) * 100;
  const fatPercentage = (appContext.fatConsumed / appContext.fatTarget) * 100;

  // Check if rings are complete
  const ringsComplete = caloriePercentage >= 100 && proteinPercentage >= 100 && carbsPercentage >= 100 && fatPercentage >= 100;

  // Trigger ripple when rings complete
  useEffect(() => {
    if (ringsComplete && !showWaterRipple) {
      setShowWaterRipple(true);
      setTimeout(() => setShowWaterRipple(false), 3000);
      toast({
        title: "Perfect Balance! 🌊",
        description: "All rings complete — Ottr is proud of you!",
      });
    }
  }, [ringsComplete]);

  // Dynamic otter mood based on time of day and completion
  const getOtterState = (): { mood: OtterMood } => {
    if (ringsComplete && timeOfDay === "night") {
      return { mood: "sleepy" };
    }
    if (ringsComplete) {
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

  const handleMicroQuestComplete = async (quest: 'hydration' | 'snack' | 'reflection') => {
    await impact();
    
    if (quest === 'hydration') {
      setHydrationComplete(true);
      toast({ title: "Hydration Hero! 💧", description: "+10 XP" });
    } else if (quest === 'snack') {
      setSnackComplete(true);
      toast({ title: "Snack Explorer! 🍓", description: "+10 XP" });
    } else {
      setReflectionComplete(true);
      toast({ title: "Reflection Ripple! 🌊", description: "+10 XP" });
    }
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
        <main className="relative max-w-md mx-auto px-6 pt-8 pb-8 space-y-6">
          
          {/* Header Zone - Greeting + Ottr */}
          <section className="text-center space-y-2 animate-fade-in">
            {greetingMessage && (
              <>
                <div className="flex justify-center mb-2">
                  <div className="w-24 h-24">
                    <OtterMascot 
                      mood={otterState.mood}
                      animate={true}
                    />
                  </div>
                </div>
                <h1 className="text-xl font-semibold text-foreground">
                  {greetingMessage}
                </h1>
                {subGreeting && (
                  <p className="text-sm text-muted-foreground">
                    {subGreeting}
                  </p>
                )}
              </>
            )}
          </section>

          {/* Core Tracker Zone - Calorie & Macro Rings */}
          <section className="space-y-6 py-4">
            {/* Main Calorie Ring */}
            <div className="flex justify-center relative">
              <div className={cn(
                "relative transition-all duration-500",
                ringsComplete && "animate-[glow-pulse_2s_ease-in-out_infinite]"
              )}>
                <CircularProgress
                  percentage={caloriePercentage}
                  size={220}
                  strokeWidth={16}
                  label="Calories"
                  value={`${Math.round(caloriesConsumed)} / ${caloriesTarget}`}
                  status={caloriePercentage >= 100 ? "success" : "normal"}
                  showGlow={ringsComplete}
                />
                {/* XP/Streak integrated glow */}
                {(streak > 0 || level > 1) && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-full px-3 py-1 border border-primary/20">
                    <span className="text-xs text-primary font-medium">Lv.{level}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-orange-500 font-medium">{streak}🔥</span>
                  </div>
                )}
              </div>
            </div>

            {/* Orbiting Macro Rings */}
            <div className="grid grid-cols-3 gap-3 px-4">
              <button 
                onClick={handleQuickLog}
                className="transition-transform active:scale-95"
              >
                <MacroRing
                  label="Protein"
                  current={Math.round(appContext.proteinConsumed)}
                  target={appContext.proteinTarget}
                  color="hsl(var(--chart-1))"
                  unit="g"
                />
              </button>
              <button 
                onClick={handleQuickLog}
                className="transition-transform active:scale-95"
              >
                <MacroRing
                  label="Carbs"
                  current={Math.round(appContext.carbsConsumed)}
                  target={appContext.carbsTarget}
                  color="hsl(var(--chart-2))"
                  unit="g"
                />
              </button>
              <button 
                onClick={handleQuickLog}
                className="transition-transform active:scale-95"
              >
                <MacroRing
                  label="Fat"
                  current={Math.round(appContext.fatConsumed)}
                  target={appContext.fatTarget}
                  color="hsl(var(--chart-3))"
                  unit="g"
                />
              </button>
            </div>
          </section>

          {/* Micro-Quests Section */}
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground px-2">Daily Focus</h2>
            <div className="grid grid-cols-1 gap-3">
              {/* Hydration Quest */}
              <button
                onClick={() => !hydrationComplete && handleMicroQuestComplete('hydration')}
                disabled={hydrationComplete}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300",
                  hydrationComplete 
                    ? "bg-primary/10 border-primary/30 opacity-60" 
                    : "bg-card border-border hover:border-primary/50 active:scale-[0.98]"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  hydrationComplete ? "bg-primary/20" : "bg-primary/10"
                )}>
                  <Droplet className={cn("w-5 h-5", hydrationComplete ? "text-primary" : "text-primary/70")} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm text-foreground">Hydration Hero</p>
                  <p className="text-xs text-muted-foreground">Log 8 glasses today</p>
                </div>
                {hydrationComplete && <span className="text-lg">✨</span>}
              </button>

              {/* Snack Quest */}
              <button
                onClick={() => !snackComplete && handleMicroQuestComplete('snack')}
                disabled={snackComplete}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300",
                  snackComplete 
                    ? "bg-primary/10 border-primary/30 opacity-60" 
                    : "bg-card border-border hover:border-primary/50 active:scale-[0.98]"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  snackComplete ? "bg-primary/20" : "bg-primary/10"
                )}>
                  <Apple className={cn("w-5 h-5", snackComplete ? "text-primary" : "text-primary/70")} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm text-foreground">Snack Explorer</p>
                  <p className="text-xs text-muted-foreground">Try a new healthy snack</p>
                </div>
                {snackComplete && <span className="text-lg">✨</span>}
              </button>

              {/* Reflection Quest */}
              <button
                onClick={() => !reflectionComplete && handleMicroQuestComplete('reflection')}
                disabled={reflectionComplete}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300",
                  reflectionComplete 
                    ? "bg-primary/10 border-primary/30 opacity-60" 
                    : "bg-card border-border hover:border-primary/50 active:scale-[0.98]"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  reflectionComplete ? "bg-primary/20" : "bg-primary/10"
                )}>
                  <BookOpen className={cn("w-5 h-5", reflectionComplete ? "text-primary" : "text-primary/70")} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm text-foreground">Reflection Ripple</p>
                  <p className="text-xs text-muted-foreground">Add one positive note</p>
                </div>
                {reflectionComplete && <span className="text-lg">✨</span>}
              </button>
            </div>
          </section>

        </main>
      </PullToRefresh>

      {/* Interface Layer - Floating Action Button (handled by MobileBottomNav) */}
      <MobileBottomNav onQuickLog={handleQuickLog} />
    </div>
  );
};

export default Dashboard;
