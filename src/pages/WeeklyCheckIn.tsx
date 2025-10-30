import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, Sparkles, Droplets, Footprints, Heart, TrendingUp, Scale, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useHaptics } from "@/hooks/useHaptics";
import { OtterMascot, OtterMood } from "@/components/OtterMascot";
import { XPBar } from "@/components/XPBar";
import { Confetti } from "@/components/Confetti";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

type DailyLog = {
  day: string;
  nutrition: number;
  hydration: number;
  movement: boolean;
  mood: string | null;
  weight?: number;
  reflection: string;
  logged: boolean;
};

type ViewMode = "daily" | "trends" | "recap";

const WeeklyCheckIn = () => {
  const navigate = useNavigate();
  const { notification, impact } = useHaptics();
  const [showConfetti, setShowConfetti] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  
  // Current day (0 = Monday, 6 = Sunday) - mock as Wednesday (day 2)
  const [currentDayIndex, setCurrentDayIndex] = useState(2);
  
  // Daily logging state
  const [todayNutrition, setTodayNutrition] = useState(75);
  const [todayHydration, setTodayHydration] = useState(80);
  const [todayMovement, setTodayMovement] = useState(false);
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [todayReflection, setTodayReflection] = useState("");
  const [todayWeight, setTodayWeight] = useState("");
  const [trackWeight, setTrackWeight] = useState(false);
  const [dailyWeightTracking, setDailyWeightTracking] = useState(false);

  // Mock weekly data - in real app, this would be stored
  const [weeklyLogs, setWeeklyLogs] = useState<DailyLog[]>([
    { day: "Mon", nutrition: 85, hydration: 90, movement: true, mood: "😊", reflection: "", logged: true },
    { day: "Tue", nutrition: 78, hydration: 85, movement: true, mood: "🙂", reflection: "", logged: true },
    { day: "Wed", nutrition: 75, hydration: 80, movement: false, mood: null, reflection: "", logged: false },
    { day: "Thu", nutrition: 0, hydration: 0, movement: false, mood: null, reflection: "", logged: false },
    { day: "Fri", nutrition: 0, hydration: 0, movement: false, mood: null, reflection: "", logged: false },
    { day: "Sat", nutrition: 0, hydration: 0, movement: false, mood: null, reflection: "", logged: false },
    { day: "Sun", nutrition: 0, hydration: 0, movement: false, mood: null, reflection: "", logged: false },
  ]);

  const currentXP = 2100;
  const maxXP = 2500;
  const currentLevel = 12;
  const xpPerLog = 50;

  const moodOptions = [
    { emoji: "😊", label: "Great" },
    { emoji: "🙂", label: "Good" },
    { emoji: "😐", label: "Okay" },
    { emoji: "😔", label: "Tired" },
    { emoji: "🤗", label: "Proud" },
  ];

  const weeklyBadges = [
    { name: "Hydration Hero", description: "Stayed hydrated 6+ days", icon: "💧", unlocked: true },
    { name: "Balanced Bites", description: "Great macro balance", icon: "🥗", unlocked: true },
    { name: "Active Adventurer", description: "Moved 5+ days", icon: "🦦", unlocked: true },
  ];

  // Calculate weekly stats
  const daysLogged = weeklyLogs.filter(log => log.logged).length;
  const totalDays = 7;
  const weekComplete = daysLogged === totalDays;
  
  const weeklyStats = useMemo(() => {
    const logged = weeklyLogs.filter(log => log.logged);
    if (logged.length === 0) return { nutrition: 0, hydration: 0, movement: 0, totalXP: 0 };
    
    return {
      nutrition: Math.round(logged.reduce((sum, log) => sum + log.nutrition, 0) / logged.length),
      hydration: Math.round(logged.reduce((sum, log) => sum + log.hydration, 0) / logged.length),
      movement: logged.filter(log => log.movement).length,
      totalXP: daysLogged * xpPerLog,
    };
  }, [weeklyLogs, daysLogged]);

  // Chart data
  const chartData = weeklyLogs.map((log, i) => ({
    day: log.day,
    nutrition: log.logged ? log.nutrition : null,
    hydration: log.logged ? log.hydration : null,
    isToday: i === currentDayIndex,
  }));

  const handleLogToday = async () => {
    if (!todayMood) {
      toast({
        title: "Almost there!",
        description: "Please select your mood to complete today's log",
        variant: "destructive",
      });
      return;
    }

    await impact();
    
    // Update weekly logs
    const updated = [...weeklyLogs];
    updated[currentDayIndex] = {
      day: updated[currentDayIndex].day,
      nutrition: todayNutrition,
      hydration: todayHydration,
      movement: todayMovement,
      mood: todayMood,
      weight: todayWeight ? parseFloat(todayWeight) : undefined,
      reflection: todayReflection,
      logged: true,
    };
    setWeeklyLogs(updated);

    setShowConfetti(true);
    await notification("success");
    
    toast({
      title: "Day logged! 🦦",
      description: `+${xpPerLog} XP earned!`,
    });

    setTimeout(() => {
      setShowConfetti(false);
      // Check if week is complete
      if (updated.filter(log => log.logged).length === 7) {
        setViewMode("recap");
      }
    }, 2000);
  };

  const handleStartNewWeek = async () => {
    await notification("success");
    toast({
      title: "New week started! 🌟",
      description: "Let's make it amazing!",
    });
    setTimeout(() => navigate("/"), 1500);
  };

  const getStatusLabel = (score: number) => {
    if (score >= 80) return { label: "Balanced", color: "text-success" };
    if (score >= 60) return { label: "Good", color: "text-primary" };
    return { label: "Needs Love", color: "text-muted-foreground" };
  };

  const getOttrMessage = () => {
    if (viewMode === "recap") return "You crushed it this week!";
    if (daysLogged === 0) return "Ready to start your wellness week?";
    if (daysLogged >= 5) return "Amazing consistency! Keep it up!";
    if (daysLogged >= 3) return "You're doing great!";
    return "Every day is progress!";
  };

  const getOttrMood = (): OtterMood => {
    if (viewMode === "recap") return "proud";
    if (daysLogged >= 5) return "joyful";
    if (daysLogged >= 3) return "happy";
    return "encouraging";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-24">
      <Confetti active={showConfetti} />

      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground flex-1">
            {viewMode === "recap" ? "Weekly Recap" : "Wellness Tracker"}
          </h1>
          <ThemeToggle />
        </div>

        {/* View Toggle */}
        {!weekComplete && (
          <div className="max-w-md mx-auto px-4 pb-3">
            <div className="flex gap-2 bg-muted rounded-2xl p-1">
              <button
                onClick={() => setViewMode("daily")}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                  viewMode === "daily"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setViewMode("trends")}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                  viewMode === "trends"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Week View
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Ottr Greeting + Progress */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border animate-scale-in">
          <div className="flex flex-col items-center text-center gap-4 mb-4">
            <OtterMascot mood={getOttrMood()} message={getOttrMessage()} />
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">Weekly Progress</span>
              </div>
              <span className="text-lg font-bold text-primary">
                {daysLogged}/{totalDays} days
              </span>
            </div>
            <div className="flex gap-1 mt-3">
              {weeklyLogs.map((log, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    log.logged
                      ? "bg-primary animate-scale-in"
                      : i === currentDayIndex
                      ? "bg-primary/30 animate-pulse"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <XPBar current={currentXP} max={maxXP} level={currentLevel} />
          </div>
        </div>

        {/* Daily View */}
        {viewMode === "daily" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-foreground px-1">
              Log Today - {weeklyLogs[currentDayIndex].day}
            </h2>

            {/* Nutrition Balance Overview */}
            <div className="bg-card rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🥗</span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Nutrition Balance</h3>
                    <p className="text-xs text-muted-foreground">From food logging</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-primary">{todayNutrition}%</span>
              </div>
              
              {/* Macro Breakdown */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Protein</span>
                  <span className="font-medium text-foreground">28g / 30%</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: '30%' }} />
                  <div className="h-1.5 rounded-full bg-muted flex-1" />
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Carbs</span>
                  <span className="font-medium text-foreground">85g / 45%</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-1.5 rounded-full bg-accent" style={{ width: '45%' }} />
                  <div className="h-1.5 rounded-full bg-muted flex-1" />
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Fats</span>
                  <span className="font-medium text-foreground">22g / 25%</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-1.5 rounded-full bg-success" style={{ width: '25%' }} />
                  <div className="h-1.5 rounded-full bg-muted flex-1" />
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  📊 3 meals logged • 🍎 4 food items • 🥗 Good variety
                </p>
              </div>
            </div>

            {/* Hydration Overview */}
            <div className="bg-card rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Hydration</h3>
                    <p className="text-xs text-muted-foreground">Tracked intake</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-primary">{todayHydration}%</span>
              </div>

              {/* Water Intake Visual */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Daily goal: 2000ml</span>
                  <span className="font-medium text-foreground">1600ml logged</span>
                </div>
                <div className="relative h-8 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-500"
                    style={{ width: `${todayHydration}%` }}
                  >
                    <div className="absolute inset-0 animate-pulse bg-white/20" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-foreground drop-shadow-sm">
                      💧 💧 💧 💧
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Morning</p>
                  <p className="text-sm font-semibold text-foreground">600ml</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Afternoon</p>
                  <p className="text-sm font-semibold text-foreground">800ml</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Evening</p>
                  <p className="text-sm font-semibold text-foreground">200ml</p>
                </div>
              </div>
            </div>

            {/* Movement Overview */}
            <div className="bg-card rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Footprints className="w-5 h-5 text-accent" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Movement</h3>
                    <p className="text-xs text-muted-foreground">From health apps</p>
                  </div>
                </div>
                <Switch checked={todayMovement} onCheckedChange={setTodayMovement} />
              </div>

              {/* Activity Breakdown */}
              {todayMovement && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>🚶</span>
                      <span className="text-foreground">Steps</span>
                    </div>
                    <span className="font-semibold text-foreground">8,432</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>🔥</span>
                      <span className="text-foreground">Active mins</span>
                    </div>
                    <span className="font-semibold text-foreground">42 min</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>⚡</span>
                      <span className="text-foreground">Calories</span>
                    </div>
                    <span className="font-semibold text-foreground">324 kcal</span>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      📱 Synced from Apple Health • Last updated 2h ago
                    </p>
                  </div>
                </div>
              )}

              {!todayMovement && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  Toggle on to log today's movement
                </p>
              )}
            </div>

            {/* Optional Weight Tracking */}
            <div className="bg-card rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Weight (Optional)</h3>
                </div>
                <Switch checked={trackWeight} onCheckedChange={setTrackWeight} />
              </div>
              
              {trackWeight && (
                <div className="space-y-3 animate-fade-in">
                  <input
                    type="number"
                    placeholder="Enter weight"
                    value={todayWeight}
                    onChange={(e) => setTodayWeight(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground"
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={dailyWeightTracking}
                      onCheckedChange={setDailyWeightTracking}
                    />
                    <p className="text-xs text-muted-foreground">Track daily (vs weekly)</p>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    💜 Remember: Weight is just data, not a measure of progress or worth
                  </p>
                </div>
              )}
            </div>

            {/* Mood Picker */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-5 border border-primary/20">
              <label className="text-sm font-semibold text-foreground block mb-3">
                How are you feeling today?
              </label>
              <div className="flex gap-2 justify-between">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.label}
                    onClick={async () => {
                      await impact();
                      setTodayMood(mood.emoji);
                    }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all active:scale-95 ${
                      todayMood === mood.emoji
                        ? "bg-primary/20 border-2 border-primary scale-110"
                        : "bg-card border border-border"
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-[10px] font-medium text-foreground">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Reflection */}
            <div className="bg-card rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border">
              <label className="text-sm font-semibold text-foreground block mb-2">
                Quick reflection (optional)
              </label>
              <Textarea
                placeholder="Anything you want to remember about today..."
                value={todayReflection}
                onChange={(e) => setTodayReflection(e.target.value)}
                className="min-h-[60px] rounded-2xl"
              />
            </div>

            {/* Log Button */}
            <Button
              onClick={handleLogToday}
              disabled={!todayMood}
              className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg font-bold active:scale-95 rounded-2xl"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Log Today (+{xpPerLog} XP)
            </Button>
          </div>
        )}

        {/* Weekly Trends View */}
        {viewMode === "trends" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-foreground px-1">Weekly Trends</h2>

            {/* Nutrition Trend */}
            <div className="bg-card rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🥗</span>
                  <h3 className="text-sm font-semibold text-foreground">Nutrition Balance</h3>
                </div>
                <span className="text-lg font-bold text-primary">{weeklyStats.nutrition}%</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={chartData}>
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="nutrition"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Hydration Trend */}
            <div className="bg-card rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Hydration</h3>
                </div>
                <span className="text-lg font-bold text-primary">{weeklyStats.hydration}%</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={chartData}>
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="hydration"
                    stroke="hsl(var(--accent))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--accent))", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Movement Days */}
            <div className="bg-card rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Footprints className="w-5 h-5 text-accent" />
                  <h3 className="text-sm font-semibold text-foreground">Movement</h3>
                </div>
                <span className="text-lg font-bold text-primary">{weeklyStats.movement} days</span>
              </div>
              <div className="flex gap-2 justify-between">
                {weeklyLogs.map((log, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        log.movement && log.logged
                          ? "bg-primary text-primary-foreground scale-110 animate-scale-in"
                          : log.logged
                          ? "bg-muted text-muted-foreground"
                          : "bg-muted/50 text-muted-foreground/50"
                      }`}
                    >
                      {log.movement && log.logged ? "🦦" : log.day[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ottr Encouragement */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-5 border border-primary/20">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🦦</span>
                <p className="text-sm text-foreground">
                  {daysLogged >= 5
                    ? "Your consistency is incredible! Keep going!"
                    : daysLogged >= 3
                    ? "You're building amazing habits!"
                    : "Every log is a step forward!"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Recap View */}
        {viewMode === "recap" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-foreground px-1">Weekly Summary</h2>

            {/* Weekly Averages */}
            <div className="bg-card rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border space-y-3">
              <h3 className="text-sm font-semibold text-foreground mb-3">Weekly Averages</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🥗</span>
                  <span className="text-sm text-foreground">Nutrition</span>
                </div>
                <span className="text-lg font-bold text-primary">{weeklyStats.nutrition}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">Hydration</span>
                </div>
                <span className="text-lg font-bold text-primary">{weeklyStats.hydration}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground">Movement</span>
                </div>
                <span className="text-lg font-bold text-primary">{weeklyStats.movement} days</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Total XP</span>
                </div>
                <span className="text-xl font-bold text-primary">+{weeklyStats.totalXP}</span>
              </div>
            </div>

            {/* Badges Earned */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground px-1">Badges Earned</h3>
              <div className="grid grid-cols-3 gap-3">
                {weeklyBadges.map((badge) => (
                  <div
                    key={badge.name}
                    className="bg-card rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.3)] border border-border flex flex-col items-center text-center gap-2 animate-scale-in"
                  >
                    <span className="text-3xl">{badge.icon}</span>
                    <p className="text-xs font-semibold text-foreground leading-tight">
                      {badge.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ottr's Personal Message */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-6 border border-primary/20">
              <div className="flex flex-col items-center text-center gap-3">
                <span className="text-4xl">🦦</span>
                <p className="text-base font-semibold text-foreground">
                  You showed up every single day this week!
                </p>
                <p className="text-sm text-muted-foreground">
                  Your consistency is building lasting healthy habits. I'm so proud of you! 💜
                </p>
              </div>
            </div>

            {/* Start New Week Button */}
            <Button
              onClick={handleStartNewWeek}
              className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg font-bold active:scale-95 rounded-2xl"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start New Week
            </Button>
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default WeeklyCheckIn;
