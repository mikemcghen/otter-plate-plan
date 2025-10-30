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
import { EmptyState } from "@/components/EmptyState";
import { OtterMascot } from "@/components/OtterMascot";
import type { OtterMood } from "@/components/OtterMascot";
import { useAppContext } from "@/contexts/AppContext";
import { Moon, UtensilsCrossed, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/useHaptics";
import { useBadgeUnlock } from "@/hooks/useBadgeUnlock";
import { BadgeUnlockModal } from "@/components/BadgeUnlockModal";
import { FriendWaves } from "@/components/FriendWaves";
import { AddFriendModal } from "@/components/AddFriendModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { OttrDailyRecap } from "@/components/OttrDailyRecap";
import { DailyMissionCard } from "@/components/DailyMissionCard";
import { AchievementCapsule } from "@/components/AchievementCapsule";
import { WeeklyTrendMini } from "@/components/WeeklyTrendMini";
import { FriendWaveModal } from "@/components/FriendWaveModal";
import { useNotifications } from "@/contexts/NotificationContext";
import otterPerfect from "@/assets/otter-perfect.png";
import otterHappy from "@/assets/otter-happy.png";
import otterSleepy from "@/assets/otter-sleepy.png";
import otterConcerned from "@/assets/otter-concerned.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const [showEndOfDay, setShowEndOfDay] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(level);
  const [logAnimation, setLogAnimation] = useState(false);
  const [showBadgeUnlock, setShowBadgeUnlock] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<any>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [achievementToShow, setAchievementToShow] = useState<any>(null);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [showFriendModal, setShowFriendModal] = useState(false);

  // Badge unlock hook
  useBadgeUnlock(xp, level, streak, foodLogs.length, (badge) => {
    setUnlockedBadge(badge);
    setShowBadgeUnlock(true);
  });

  // Load friends (with placeholders for demo)
  useEffect(() => {
    if (user) {
      loadFriends();
    } else {
      // Show placeholder friends when not logged in
      setFriends(placeholderFriends);
    }
  }, [user]);

  const placeholderFriends = [
    {
      id: "1",
      display_name: "Emma",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      level: 8,
      xp: 420,
      streak: 12,
      caloriePercentage: 98,
    },
    {
      id: "2",
      display_name: "Marcus",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      level: 5,
      xp: 280,
      streak: 7,
      caloriePercentage: 102,
    },
    {
      id: "3",
      display_name: "Sofia",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
      level: 12,
      xp: 750,
      streak: 21,
      caloriePercentage: 95,
    },
    {
      id: "4",
      display_name: "Alex",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      level: 3,
      xp: 150,
      streak: 4,
      caloriePercentage: 88,
    },
    {
      id: "5",
      display_name: "Jasmine",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasmine",
      level: 15,
      xp: 920,
      streak: 30,
      caloriePercentage: 100,
    },
  ];

  const loadFriends = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("friendships")
      .select(`
        *,
        friend:profiles!friendships_friend_id_fkey(*)
      `)
      .eq("user_id", user.id)
      .eq("status", "accepted");

    if (data && data.length > 0) {
      const friendProfiles = data.map(f => ({
        ...f.friend,
        level: Math.floor(Math.random() * 10) + 1,
        xp: Math.floor(Math.random() * 500),
        streak: Math.floor(Math.random() * 30),
        caloriePercentage: Math.floor(Math.random() * 120) + 50,
      }));
      setFriends(friendProfiles);
    } else {
      // Use placeholders if no friends found
      setFriends(placeholderFriends);
    }
  };

  const handleAddFriend = async (method: string, value: string) => {
    toast({
      title: "Friend request sent!",
      description: `Request sent via ${method}`,
    });
    setShowAddFriend(false);
  };

  const handleFriendClick = (friend: any) => {
    setSelectedFriend(friend);
    setShowFriendModal(true);
  };

  const handleSendWave = () => {
    toast({
      title: "Wave sent! 🌊",
      description: `Your encouragement reached ${selectedFriend?.display_name}`,
    });
  };

  const handleViewPost = () => {
    navigate("/trends");
  };

  // Demo: trigger achievement after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (foodLogs.length >= 3 && !achievementToShow) {
        setAchievementToShow({
          id: "snack-100",
          title: "Century of Snacks!",
          description: "You've logged 100 snacks - Ottr is proud!",
          icon: "🎉"
        });
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [foodLogs, achievementToShow]);

  // Manual trigger functions for test panel
  const handleTriggerDailyGreeting = () => setShowDailyGreeting(true);
  const handleTriggerEndOfDay = () => setShowEndOfDay(true);
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
      onEndOfDay: handleTriggerEndOfDay,
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
  const isInMaintenanceZone = caloriePercentage >= 90 && caloriePercentage <= 110;
  const isPerfect = caloriePercentage >= 95 && caloriePercentage <= 105;
  const isUnder = caloriePercentage < 90;
  const isOver = caloriePercentage > 110;
  const caloriesRemaining = getCaloriesRemaining();

  // Dynamic background based on status
  const getBackgroundGradient = () => {
    if (isPerfect) return "bg-perfect-gradient";
    if (isInMaintenanceZone) return "bg-maintenance-gradient";
    if (isUnder) return "bg-under-gradient";
    if (isOver) return "bg-over-gradient";
    return "bg-default-gradient";
  };
  
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

  // Dynamic otter mood and message based on status
  const getOtterState = (): { mood: OtterMood; message: string; image: string } => {
    if (isPerfect) return { mood: "proud", message: "Perfect balance! You're crushing it!", image: otterPerfect };
    if (isInMaintenanceZone) return { mood: "happy", message: "Great job! Right in the zone!", image: otterHappy };
    if (isUnder) return { mood: "hungry", message: "You need more energy! Let's add a snack", image: otterSleepy };
    if (isOver) return { mood: "encouraging", message: "A bit high today, but that's okay!", image: otterConcerned };
    return { mood: "happy", message: "Keep going! You're doing great!", image: otterHappy };
  };

  const otterState = getOtterState();

  const snackOptions = [
    { name: "Greek Yogurt with Berries", calories: 150, protein: 15, emoji: "berry" },
    { name: "Apple with Almond Butter", calories: 180, protein: 8, emoji: "apple" },
    { name: "Protein Smoothie", calories: 200, protein: 20, emoji: "cup-soda" },
  ];

  const handleLogSnack = async (snack: typeof snackOptions[0]) => {
    await notification("success");
    
    // Trigger animation
    setLogAnimation(true);
    setTimeout(() => setLogAnimation(false), 600);
    
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
        title: "Snack logged!",
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
    
    // Trigger animation
    setLogAnimation(true);
    setTimeout(() => setLogAnimation(false), 600);
    
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
      title: "Food logged!",
      description: `${food.name} added • +15 XP`,
    });

    if (isPerfect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
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
    <div className={`min-h-screen pb-24 transition-all duration-700 ${getBackgroundGradient()}`}>
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

      {/* Badge Unlock Modal */}
      {unlockedBadge && (
        <BadgeUnlockModal
          open={showBadgeUnlock}
          onOpenChange={setShowBadgeUnlock}
          badgeName={unlockedBadge.name}
          badgeDescription={unlockedBadge.description}
        />
      )}

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
        {/* Daily Mission Card */}
        <DailyMissionCard />

        {/* Hero Section: Mascot + Progress */}
        <div className={`bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-2 border-border transition-all duration-[2000ms] ${logAnimation ? "animate-success-bounce" : ""}`}>
          <div className="flex flex-col items-center gap-4">
            {/* Mascot Integration */}
            <OtterMascot 
              mood={otterState.mood} 
              message={otterState.message}
              animate={true}
            />
            
            {/* Calorie Progress Ring */}
            <div className={`transition-transform duration-[1500ms] ${logAnimation ? "animate-pulse-scale" : ""}`}>
              <CircularProgress
                percentage={caloriePercentage}
                size={200}
                strokeWidth={14}
                value={`${caloriesConsumed}`}
                label={`of ${caloriesTarget} cal`}
                status={isPerfect ? "success" : isInMaintenanceZone ? "normal" : "warning"}
                showGlow={isPerfect}
              />
            </div>

            {/* Encouraging Status Text */}
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-muted-foreground">
                {caloriesRemaining > 0 
                  ? `${caloriesRemaining} cal to go` 
                  : caloriesRemaining === 0 
                  ? "Perfect! You hit your target!" 
                  : `${Math.abs(caloriesRemaining)} cal over`}
              </p>
              {isPerfect && (
                <div className="flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-success animate-breathing" />
                  <p className="text-xs text-success font-medium animate-shimmer bg-gradient-to-r from-success via-primary to-success bg-clip-text text-transparent bg-[length:200%_auto]">
                    You're in the perfect zone!
                  </p>
                  <Sparkles className="w-3 h-3 text-success animate-breathing" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Macro Rings */}
        <div className={`bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-2 border-border transition-all duration-[1500ms] ${logAnimation ? "animate-pulse-scale" : ""}`}>
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

        {/* Friend Waves */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-2 border-border">
          <FriendWaves
            friends={friends}
            onAddFriend={() => setShowAddFriend(true)}
            onFriendClick={handleFriendClick}
          />
        </div>

        {/* Snack Carousel */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-2 border-border">
          {foodLogs.length === 0 ? (
            <EmptyState
              variant="encourage"
              title="Ottr's waiting for your first splash!"
              description="Start your day by logging your first meal. Every journey begins with a single bite!"
              action={{
                label: "Log Your First Food",
                onClick: handleQuickLog,
              }}
              icon={<UtensilsCrossed className="w-12 h-12" />}
            />
          ) : (
            <SnackCarousel
              snacks={snackOptions}
              onLog={handleLogSnack}
              otterImage={otterState.image}
            />
          )}
        </div>

        {/* Weekly Trend Mini */}
        <WeeklyTrendMini />

        {/* Ottr's Daily Recap */}
        {user && <OttrDailyRecap />}

        </main>
      </PullToRefresh>

      {/* Add Friend Modal */}
      <AddFriendModal
        open={showAddFriend}
        onOpenChange={setShowAddFriend}
        onAddFriend={handleAddFriend}
      />

      {/* Friend Wave Modal */}
      <FriendWaveModal
        open={showFriendModal}
        onOpenChange={setShowFriendModal}
        friend={selectedFriend}
        onSendWave={handleSendWave}
        onViewPost={handleViewPost}
      />

      {/* Achievement Capsule */}
      <AchievementCapsule
        achievement={achievementToShow}
        onDismiss={() => setAchievementToShow(null)}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onQuickLog={handleQuickLog} />
    </div>
  );
};

export default Dashboard;
