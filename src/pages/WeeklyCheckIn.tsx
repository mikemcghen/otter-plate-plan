import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, Sparkles, Droplets, Footprints, Heart, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useHaptics } from "@/hooks/useHaptics";
import { OtterMascot } from "@/components/OtterMascot";
import { MacroRing } from "@/components/MacroRing";
import { BadgeCard } from "@/components/BadgeCard";
import { XPBar } from "@/components/XPBar";
import { Confetti } from "@/components/Confetti";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const WeeklyCheckIn = () => {
  const navigate = useNavigate();
  const { notification } = useHaptics();
  const [reflection, setReflection] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Mock data - in real app, this would come from user's activity
  const weeklyXP = 450;
  const currentXP = 2100;
  const maxXP = 2500;
  const currentLevel = 12;

  const movementDays = [true, true, false, true, true, true, false]; // Mon-Sun
  const hydrationScore = 85; // out of 100
  const nutritionBalance = 78; // macro balance score
  const weeklyVariety = 92; // food variety score

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

  const suggestedGoals = [
    "Try to move 4 days next week",
    "Add one new vegetable to your meals",
  ];

  const handleCelebrate = async () => {
    setShowConfetti(true);
    await notification("success");
    toast({
      title: "Week celebrated! 🎉",
      description: `+${weeklyXP} XP earned this week!`,
    });
    setTimeout(() => navigate("/"), 2000);
  };

  const getStatusLabel = (score: number) => {
    if (score >= 80) return { label: "Balanced", color: "text-success" };
    if (score >= 60) return { label: "Good", color: "text-primary" };
    return { label: "Needs Love", color: "text-muted-foreground" };
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
          <h1 className="text-xl font-bold text-foreground flex-1">Weekly Reflection</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Ottr Greeting + XP Summary */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border animate-scale-in">
          <div className="flex flex-col items-center text-center gap-4 mb-4">
            <OtterMascot mood="proud" message="You showed up this week!" />
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">Weekly XP</span>
            </div>
            <span className="text-2xl font-bold text-primary">+{weeklyXP}</span>
          </div>

          <div className="mt-4">
            <XPBar current={currentXP} max={maxXP} level={currentLevel} />
          </div>
        </div>

        {/* Habit Overview */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground px-1">This Week's Habits</h2>

          {/* Nutrition Balance */}
          <div className="bg-card rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-xl">🥗</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Nutrition Balance</h3>
                  <p className={`text-xs font-medium ${getStatusLabel(nutritionBalance).color}`}>
                    {getStatusLabel(nutritionBalance).label}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{nutritionBalance}%</p>
                <p className="text-xs text-muted-foreground">macro balance</p>
              </div>
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>🌈 {weeklyVariety}% food variety</span>
            </div>
          </div>

          {/* Hydration */}
          <div className="bg-card rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Hydration</h3>
                  <p className={`text-xs font-medium ${getStatusLabel(hydrationScore).color}`}>
                    {getStatusLabel(hydrationScore).label}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{hydrationScore}%</p>
                <p className="text-xs text-muted-foreground">consistency</p>
              </div>
            </div>
          </div>

          {/* Movement */}
          <div className="bg-card rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Footprints className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Movement</h3>
                  <p className="text-xs font-medium text-success">
                    {movementDays.filter(Boolean).length} days active
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-1.5 justify-between">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      movementDays[i]
                        ? "bg-primary text-primary-foreground scale-110"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {movementDays[i] ? "🦦" : day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reflection Section */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-6 border border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Weekly Reflection</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                What are you proud of this week?
              </label>
              <Textarea
                placeholder="Share something you're proud of..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="min-h-[80px] rounded-2xl"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-3">
                How are you feeling?
              </label>
              <div className="flex gap-2 justify-between">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.label}
                    onClick={() => setSelectedMood(mood.label)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all active:scale-95 ${
                      selectedMood === mood.label
                        ? "bg-primary/20 border-2 border-primary scale-110"
                        : "bg-card border border-border hover:bg-muted"
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-[10px] font-medium text-foreground">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Badges Earned</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {weeklyBadges.map((badge) => (
              <div
                key={badge.name}
                className="bg-card rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.3)] border border-border flex flex-col items-center text-center gap-2 animate-scale-in"
              >
                <span className="text-3xl">{badge.icon}</span>
                <p className="text-xs font-semibold text-foreground leading-tight">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Week Focus */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Next Week's Focus</h2>
          </div>
          <div className="space-y-2">
            {suggestedGoals.map((goal, i) => (
              <button
                key={i}
                className="w-full text-left p-3 rounded-2xl bg-muted hover:bg-primary/10 transition-colors border border-border active:scale-98"
              >
                <p className="text-sm text-foreground">✨ {goal}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Celebrate Button */}
        <Button
          onClick={handleCelebrate}
          disabled={!selectedMood}
          className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg font-bold active:scale-95 rounded-2xl"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Celebrate My Week
        </Button>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default WeeklyCheckIn;
