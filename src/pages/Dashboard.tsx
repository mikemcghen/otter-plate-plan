import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/CircularProgress";
import { MacroRing } from "@/components/MacroRing";
import { StreakCounter } from "@/components/StreakCounter";
import { XPBar } from "@/components/XPBar";
import { SnackCarousel } from "@/components/SnackCarousel";
import { Confetti } from "@/components/Confetti";
import { Plus, TrendingUp, Settings, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import otterPerfect from "@/assets/otter-perfect.png";
import otterHappy from "@/assets/otter-happy.png";
import otterSleepy from "@/assets/otter-sleepy.png";
import otterConcerned from "@/assets/otter-concerned.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [caloriesConsumed] = useState(1450);
  const [caloriesTarget] = useState(2000);
  const [showConfetti, setShowConfetti] = useState(false);

  const caloriePercentage = (caloriesConsumed / caloriesTarget) * 100;
  const isInMaintenanceZone = caloriePercentage >= 90 && caloriePercentage <= 110;
  const isPerfect = caloriePercentage >= 95 && caloriePercentage <= 105;
  const isUnder = caloriePercentage < 90;
  const isOver = caloriePercentage > 110;

  // Dynamic otter and message based on status
  const getOtterState = () => {
    if (isPerfect) return { image: otterPerfect, message: "Perfect balance! You're crushing it! 🎉" };
    if (isInMaintenanceZone) return { image: otterHappy, message: "Great job! Right in the zone! 🎯" };
    if (isUnder) return { image: otterSleepy, message: "You need more energy! Let's add a snack 😴" };
    if (isOver) return { image: otterConcerned, message: "A bit high today, but that's okay! 💪" };
    return { image: otterHappy, message: "Keep going! You're doing great!" };
  };

  const otterState = getOtterState();

  const snackOptions = [
    { name: "Greek Yogurt with Berries", calories: 150, protein: 15, emoji: "🫐" },
    { name: "Apple with Almond Butter", calories: 180, protein: 8, emoji: "🍎" },
    { name: "Protein Smoothie", calories: 200, protein: 20, emoji: "🥤" },
  ];

  const handleLogSnack = (snack: typeof snackOptions[0]) => {
    toast({
      title: "Snack logged! 🎉",
      description: `${snack.name} added to your daily log`,
    });
    if (isPerfect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleQuickLog = () => {
    toast({
      title: "Quick log coming soon!",
      description: "This feature will let you log meals quickly",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-6">
      <Confetti active={showConfetti} />
      {/* Header with XP and Streak */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              OttrCal
            </h1>
            <StreakCounter days={12} />
          </div>
          <XPBar current={450} max={600} level={8} />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Main Calorie Ring */}
        <div className="bg-card rounded-3xl p-8 shadow-lg border border-border animate-fade-in">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground mb-1">
                Daily Calories
              </h2>
              <p className="text-sm text-muted-foreground animate-fade-in">
                {otterState.message}
              </p>
            </div>
            <CircularProgress
              percentage={caloriePercentage}
              size={200}
              strokeWidth={12}
              value={`${caloriesConsumed}`}
              label={`of ${caloriesTarget} cal`}
              status={isPerfect ? "success" : isInMaintenanceZone ? "normal" : "warning"}
              showGlow={isPerfect}
            />
          </div>
        </div>

        {/* Macro Rings */}
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4 px-2">
            Macros
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <MacroRing
              label="Protein"
              current={85}
              target={120}
              color="hsl(var(--primary))"
            />
            <MacroRing
              label="Carbs"
              current={160}
              target={200}
              color="hsl(var(--accent))"
            />
            <MacroRing
              label="Fat"
              current={45}
              target={60}
              color="hsl(var(--success))"
            />
          </div>
        </div>

        {/* Snack Carousel */}
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
          <SnackCarousel
            snacks={snackOptions}
            onLog={handleLogSnack}
            otterImage={otterState.image}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          <Button
            onClick={handleQuickLog}
            variant="outline"
            className="h-auto flex-col gap-2 py-4 border-2 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-medium">Quick Log</span>
          </Button>
          <Button
            onClick={() => navigate("/weekly-checkin")}
            variant="outline"
            className="h-auto flex-col gap-2 py-4 border-2 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-medium">Weigh In</span>
          </Button>
          <Button
            onClick={() => navigate("/weekly-checkin")}
            variant="outline"
            className="h-auto flex-col gap-2 py-4 border-2 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-medium">Trends</span>
          </Button>
          <Button
            onClick={() => toast({ title: "Settings coming soon!" })}
            variant="outline"
            className="h-auto flex-col gap-2 py-4 border-2 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs font-medium">Settings</span>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
