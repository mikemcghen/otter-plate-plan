import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/CircularProgress";
import { MacroRing } from "@/components/MacroRing";
import { StreakCounter } from "@/components/StreakCounter";
import { XPBar } from "@/components/XPBar";
import { SnackCarousel } from "@/components/SnackCarousel";
import { NotificationBanner } from "@/components/NotificationBanner";
import { SnackPickerModal } from "@/components/SnackPickerModal";
import { SuccessConfirmationModal } from "@/components/SuccessConfirmationModal";
import { Confetti } from "@/components/Confetti";
import { QuickLogPanel } from "@/components/QuickLogPanel";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { PullToRefresh } from "@/components/PullToRefresh";
import { DailyGreetingModal } from "@/components/DailyGreetingModal";
import { EndOfDaySummaryModal } from "@/components/EndOfDaySummaryModal";
import { FloatingMascotButton } from "@/components/FloatingMascotButton";
import { LevelUpModal } from "@/components/LevelUpModal";
import { useAppContext } from "@/contexts/AppContext";
import { Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/useHaptics";
import otterPerfect from "@/assets/otter-perfect.png";
import otterHappy from "@/assets/otter-happy.png";
import otterSleepy from "@/assets/otter-sleepy.png";
import otterConcerned from "@/assets/otter-concerned.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const { impact, notification } = useHaptics();
  const appContext = useAppContext();
  const {
    caloriesConsumed,
    caloriesTarget,
    proteinConsumed,
    proteinTarget,
    carbsConsumed,
    carbsTarget,
    fatConsumed,
    fatTarget,
    xp,
    level,
    streak,
    foodLogs,
    logFood,
    getXPForNextLevel,
    getCaloriesRemaining,
  } = appContext;

  const [showConfetti, setShowConfetti] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showSnackPicker, setShowSnackPicker] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [loggedSnack, setLoggedSnack] = useState<string>("");
  const [showDailyGreeting, setShowDailyGreeting] = useState(false);
  const [showEndOfDay, setShowEndOfDay] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(level);

  const caloriePercentage = (caloriesConsumed / caloriesTarget) * 100;
  const isInMaintenanceZone = caloriePercentage >= 90 && caloriePercentage <= 110;
  const isPerfect = caloriePercentage >= 95 && caloriePercentage <= 105;
  const isUnder = caloriePercentage < 90;
  const isOver = caloriePercentage > 110;
  const caloriesRemaining = getCaloriesRemaining();
  
  // Check for level up
  useEffect(() => {
    if (level > previousLevel) {
      setPreviousLevel(level);
      setShowLevelUp(true);
      setShowConfetti(true);
      notification("success");
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [level, previousLevel, notification]);

  // Check for daily greeting
  useEffect(() => {
    const lastVisit = localStorage.getItem("ottrcal_last_visit");
    const today = new Date().toDateString();
    
    if (!lastVisit || lastVisit !== today) {
      setShowDailyGreeting(true);
      localStorage.setItem("ottrcal_last_visit", today);
    }
  }, []);

  // Snack notification trigger - check time of day and calorie deficit
  useEffect(() => {
    const currentHour = new Date().getHours();
    const isAfternoon = currentHour >= 14 && currentHour < 18;
    const isEvening = currentHour >= 18;
    
    const timer = setTimeout(() => {
      if ((isAfternoon || isEvening) && caloriePercentage < 85 && !showNotification) {
        setShowNotification(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [caloriePercentage, showNotification]);

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

  const handleLogSnack = async (snack: typeof snackOptions[0]) => {
    await notification("success");
    
    // Log to context
    logFood({
      name: snack.name,
      calories: snack.calories,
      protein: snack.protein,
      carbs: 0,
      fat: 0,
    });
    
    setLoggedSnack(snack.name);
    setShowSuccessModal(true);
    setShowNotification(false);
    
    // Show toast after modal closes
    setTimeout(() => {
      toast({
        title: "Snack logged! 🎉",
        description: `${snack.name} added • +15 XP`,
      });
    }, 500);

    if (isPerfect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleQuickLog = async () => {
    await impact();
    setShowQuickLog(true);
  };

  const handleQuickLogFood = async (food: any) => {
    await notification("success");
    
    // Log to context
    logFood({
      name: food.name,
      calories: food.calories,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
    });
    
    setLoggedSnack(food.name);
    toast({
      title: "Food logged! 🎉",
      description: `${food.name} added • +15 XP`,
    });
  };

  const handleRefresh = async () => {
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Refreshed! 🌊",
      description: "Your data is up to date",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-24">
      <Confetti active={showConfetti} />
      
      {/* Daily Greeting Modal */}
      <DailyGreetingModal
        open={showDailyGreeting}
        onOpenChange={setShowDailyGreeting}
        streak={streak}
        onStart={() => setShowDailyGreeting(false)}
      />

      {/* Level Up Modal */}
      <LevelUpModal
        open={showLevelUp}
        onOpenChange={setShowLevelUp}
        level={level}
      />

      {/* End of Day Summary Modal */}
      <EndOfDaySummaryModal
        open={showEndOfDay}
        onOpenChange={setShowEndOfDay}
        xpGained={xp}
        foodsLogged={foodLogs.length}
        isPerfect={isPerfect}
      />

      {/* Floating Mascot Button */}
      <FloatingMascotButton caloriesRemaining={caloriesRemaining} />
      
      {/* Push Notification Banner */}
      <NotificationBanner
        visible={showNotification}
        message={`You're ${caloriesRemaining} calories short — Ottr suggests a snack! 🍎`}
        onOpen={() => {
          setShowSnackPicker(true);
          setShowNotification(false);
        }}
        onDismiss={() => setShowNotification(false)}
      />

      {/* Snack Picker Modal */}
      <SnackPickerModal
        open={showSnackPicker}
        onOpenChange={setShowSnackPicker}
        snacks={snackOptions}
        onLog={handleLogSnack}
        otterImage={otterState.image}
      />

      {/* Success Confirmation Modal */}
      <SuccessConfirmationModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        snackName={loggedSnack}
      />

      {/* Quick Log Panel */}
      <QuickLogPanel
        open={showQuickLog}
        onOpenChange={setShowQuickLog}
        onLog={handleQuickLogFood}
      />

      <PullToRefresh onRefresh={handleRefresh}>
        {/* Header with XP and Streak */}
        <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
          <div className="max-w-md mx-auto px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                OttrCal
              </h1>
              <div className="flex items-center gap-2">
                <StreakCounter days={streak} />
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-10 h-10 rounded-full active:scale-95 transition-transform"
                  onClick={async () => {
                    await impact();
                    setShowEndOfDay(true);
                  }}
                >
                  <Moon className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <XPBar current={xp} max={getXPForNextLevel()} level={level} />
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Main Calorie Ring */}
        <div className="bg-card rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-2 border-border animate-fade-in">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground mb-1">
                Daily Calories
              </h2>
              <p className="text-base text-muted-foreground animate-fade-in font-medium">
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
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-2 border-border">
          <h3 className="text-base font-bold text-foreground mb-4 px-2">
            Macros
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <MacroRing
              label="Protein"
              current={proteinConsumed}
              target={proteinTarget}
              color="hsl(var(--primary))"
            />
            <MacroRing
              label="Carbs"
              current={carbsConsumed}
              target={carbsTarget}
              color="hsl(var(--accent))"
            />
            <MacroRing
              label="Fat"
              current={fatConsumed}
              target={fatTarget}
              color="hsl(var(--success))"
            />
          </div>
        </div>

        {/* Snack Carousel */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-2 border-border">
          <SnackCarousel
            snacks={snackOptions}
            onLog={handleLogSnack}
            otterImage={otterState.image}
          />
        </div>

        </main>
      </PullToRefresh>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onQuickLog={handleQuickLog} />
    </div>
  );
};

export default Dashboard;
