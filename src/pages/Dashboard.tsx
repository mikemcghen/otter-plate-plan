import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/CircularProgress";
import { MacroRing } from "@/components/MacroRing";
import { StreakCounter } from "@/components/StreakCounter";
import { OttrTrail } from "@/components/OttrTrail";
import { DailyFocus } from "@/components/DailyFocus";
import { AmbientBackground } from "@/components/AmbientBackground";
import { OttrDialogBubble } from "@/components/OttrDialogBubble";
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
import { EmptyState } from "@/components/EmptyState";
import { OtterMascot } from "@/components/OtterMascot";
import type { OtterMood } from "@/components/OtterMascot";
import { useAppContext } from "@/contexts/AppContext";
import { Moon, UtensilsCrossed, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/useHaptics";
import { useBadgeUnlock } from "@/hooks/useBadgeUnlock";
import { BadgeUnlockModal } from "@/components/BadgeUnlockModal";
import { AchievementCapsule } from "@/components/AchievementCapsule";
import { FloatingBubble } from "@/components/FloatingBubble";
import { useNotifications } from "@/contexts/NotificationContext";
import otterPerfect from "@/assets/otter-perfect.png";
import otterHappy from "@/assets/otter-happy.png";
import otterSleepy from "@/assets/otter-sleepy.png";
import otterConcerned from "@/assets/otter-concerned.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dashboardTheme } = useThemeContext();
  const { impact, notification } = useHaptics();
  const appContext = useAppContext();
  const notifications = useNotifications();
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
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(level);
  const [showBadgeUnlock, setShowBadgeUnlock] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<any>(null);
  const [achievementToShow, setAchievementToShow] = useState<any>(null);
  const [bubbleMessage, setBubbleMessage] = useState<string | null>(null);
  const [ottrDialogMessage, setOttrDialogMessage] = useState<string | null>(null);
  const [userName, setUserName] = useState("Friend");
  const [focusCompleted, setFocusCompleted] = useState(false);
  const [showWaterRipple, setShowWaterRipple] = useState(false);


  // Badge unlock hook
  useBadgeUnlock(xp, level, streak, foodLogs.length, (badge) => {
    setUnlockedBadge(badge);
    setShowBadgeUnlock(true);
  });

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
      morning: `Morning, ${userName}! Ready to swim through today?`,
      afternoon: `The tide feels calm today, ${userName}`,
      evening: `Evening, ${userName}! Time to wind down`,
      night: `Rest peacefully, ${userName} 🌙`,
    };
    
    setTimeout(() => {
      setOttrDialogMessage(greetings[timeOfDay]);
    }, 2000);
  }, [timeOfDay, userName]);

  const handleViewPost = () => {
    navigate("/trends");
  };

  // Focus completion handler
  const handleFocusComplete = () => {
    setFocusCompleted(true);
    setShowWaterRipple(true);
    
    // Show completion message
    setTimeout(() => {
      setOttrDialogMessage("Ottr is resting peacefully — you've earned it 🦦💜");
    }, 800);
    
    // Hide ripple effect
    setTimeout(() => {
      setShowWaterRipple(false);
    }, 3000);
    
    toast({
      title: "Daily Focus Complete! 🌊",
      description: "You've made progress today",
    });
  };

  // Manual trigger functions for test panel
  const handleTriggerDailyGreeting = () => setShowDailyGreeting(true);
  const handleTriggerLevelUp = () => setShowLevelUp(true);
  const handleTriggerBadgeUnlock = () => {
    setUnlockedBadge({
      name: "Test Badge",
      description: "This is a test badge unlock!"
    });
    setShowBadgeUnlock(true);
  };
  const handleTriggerAchievement = () => {
    setAchievementToShow({
      id: "test-achievement",
      title: "Test Achievement!",
      description: "You manually triggered this achievement",
      icon: "🎉"
    });
  };
  const handleTriggerSnackPicker = () => setShowSnackPicker(true);
  const handleTriggerSuccessModal = () => {
    setLoggedSnack("Test Snack");
    setShowSuccessModal(true);
  };
  const handleTriggerNotificationBanner = () => setShowNotification(true);

  // Register handlers with notification context
  useEffect(() => {
    notifications.registerHandlers({
      onDailyGreeting: handleTriggerDailyGreeting,
      onLevelUp: handleTriggerLevelUp,
      onBadgeUnlock: handleTriggerBadgeUnlock,
      onAchievement: handleTriggerAchievement,
      onSnackPicker: handleTriggerSnackPicker,
      onSuccessModal: handleTriggerSuccessModal,
      onNotificationBanner: handleTriggerNotificationBanner,
      onQuickLog: () => setShowQuickLog(true),
    });
  }, []);

  const caloriePercentage = (caloriesConsumed / caloriesTarget) * 100;
  const isPerfect = caloriePercentage >= 95 && caloriePercentage <= 105;
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

  // Dynamic otter mood based on time of day and completion
  const getOtterState = (): { mood: OtterMood; message: string; image: string } => {
    if (focusCompleted && timeOfDay === "night") {
      return { mood: "sleepy", message: "Rest well, swimmer", image: otterSleepy };
    }
    if (focusCompleted) {
      return { mood: "proud", message: "", image: otterPerfect };
    }
    if (timeOfDay === "morning") {
      return { mood: "happy", message: "", image: otterHappy };
    }
    if (timeOfDay === "evening" || timeOfDay === "night") {
      return { mood: "sleepy", message: "", image: otterSleepy };
    }
    return { mood: "happy", message: "", image: otterHappy };
  };

  const otterState = getOtterState();

  const snackOptions = [
    { name: "Greek Yogurt with Berries", calories: 150, protein: 15, emoji: "berry" },
    { name: "Apple with Almond Butter", calories: 180, protein: 8, emoji: "apple" },
    { name: "Protein Smoothie", calories: 200, protein: 20, emoji: "cup-soda" },
  ];

  const handleLogSnack = async (snack: typeof snackOptions[0]) => {
    await notification("success");
    
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
    
    toast({
      title: "Snack logged! 🌊",
      description: `${snack.name} added • +15 XP`,
    });
  };

  const handleQuickLog = async () => {
    await impact();
    setShowQuickLog(true);
  };

  const handleQuickLogFood = async (food: any) => {
    await notification("success");
    
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
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Refreshed!",
      description: "Your data is up to date",
    });
  };

  return (
    <div className="min-h-screen relative pb-24 overflow-hidden">
      {/* Ambient background - The Daily Cove */}
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
      
      <Confetti active={showConfetti} />

      {/* Ottr dialog bubbles */}
      {ottrDialogMessage && (
        <OttrDialogBubble 
          message={ottrDialogMessage} 
          mood="happy"
          onDismiss={() => setOttrDialogMessage(null)}
        />
      )}
      
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

      {/* Badge Unlock Modal */}
      {unlockedBadge && (
        <BadgeUnlockModal
          open={showBadgeUnlock}
          onOpenChange={setShowBadgeUnlock}
          badgeName={unlockedBadge.name}
          badgeDescription={unlockedBadge.description}
        />
      )}

      {/* Floating Mascot Button */}
      <FloatingMascotButton caloriesRemaining={caloriesRemaining} />
      
      {/* Push Notification Banner */}
      <NotificationBanner
        visible={showNotification}
        message={`You're ${caloriesRemaining} calories short — Ottr suggests a snack!`}
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
        {/* The Daily Cove Header - Minimal & Elegant */}
        <header className="bg-transparent backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-md mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-foreground/80">
                The Daily Cove
              </h1>
              <StreakCounter days={streak} />
            </div>
            <OttrTrail progress={caloriePercentage} level={level} />
          </div>
        </header>

        {/* The Daily Cove - Living Environment */}
        <main className="relative max-w-md mx-auto px-6 py-8 space-y-8">
          
          {/* Center: Ottr Mascot (Living companion) */}
          <div className="flex justify-center items-center min-h-[200px] transition-all duration-[3000ms]">
            <OtterMascot 
              mood={otterState.mood} 
              message={otterState.message}
              animate={true}
            />
          </div>

          {/* Daily Focus Card */}
          {!focusCompleted && (
            <DailyFocus onComplete={handleFocusComplete} />
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

      {/* Achievement Capsule */}
      <AchievementCapsule
        achievement={achievementToShow}
        onDismiss={() => setAchievementToShow(null)}
      />

      {/* Floating Bubble Notification */}
      {bubbleMessage && (
        <FloatingBubble
          message={bubbleMessage}
          onDismiss={() => setBubbleMessage(null)}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onQuickLog={handleQuickLog} />
    </div>
  );
};

export default Dashboard;
