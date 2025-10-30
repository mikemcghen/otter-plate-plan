import { useState, useEffect } from "react";
import { Droplets, Apple, Heart, Sparkles } from "lucide-react";
import { OtterMascot } from "./OtterMascot";
import { cn } from "@/lib/utils";

type Mission = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  emoji: string;
};

const missions: Mission[] = [
  {
    id: "hydration",
    icon: <Droplets className="w-5 h-5 text-primary" />,
    title: "Stay hydrated 💧",
    description: "Log 3 drinks today",
    emoji: "💧"
  },
  {
    id: "protein",
    icon: <Apple className="w-5 h-5 text-success" />,
    title: "Snack smart 🍓",
    description: "Add something with protein",
    emoji: "🍓"
  },
  {
    id: "mindful",
    icon: <Heart className="w-5 h-5 text-accent" />,
    title: "Mindful moment 🌿",
    description: "Reflect on how you feel after lunch",
    emoji: "🌿"
  },
  {
    id: "balance",
    icon: <Sparkles className="w-5 h-5 text-primary" />,
    title: "Stay balanced ⚖️",
    description: "Keep your macros in the green zone",
    emoji: "⚖️"
  }
];

export const DailyMissionCard = () => {
  const [dailyMission, setDailyMission] = useState<Mission | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // Select random mission on mount
  useEffect(() => {
    const randomMission = missions[Math.floor(Math.random() * missions.length)];
    setDailyMission(randomMission);
  }, []);

  const handleComplete = () => {
    setIsCompleted(true);
    setShowCompletion(true);
    setTimeout(() => setShowCompletion(false), 3000);
  };

  if (!dailyMission) return null;

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-3xl p-6 border-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all duration-[2000ms] ease-in-out",
        isCompleted 
          ? "bg-gradient-to-br from-amber-100/80 to-yellow-100/60 dark:from-amber-950/40 dark:to-yellow-950/30 border-amber-300/50 dark:border-amber-700/50" 
          : "bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20"
      )}
    >
      {/* Shimmer effect on completion */}
      {showCompletion && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slow" />
      )}

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-card/80 flex items-center justify-center border-2 border-border">
              {dailyMission.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Daily Mission
              </p>
              <h3 className="text-base font-bold text-foreground">
                {dailyMission.title}
              </h3>
            </div>
          </div>

          {isCompleted && (
            <div className="animate-scale-in">
              <span className="text-2xl">✨</span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {dailyMission.description}
        </p>

        {/* Ottr mascot reaction */}
        {isCompleted && showCompletion && (
          <div className="animate-slide-in-right">
            <OtterMascot 
              mood="proud" 
              message="Amazing work! You completed today's mission! 🦦" 
            />
          </div>
        )}

        {/* Demo completion button */}
        {!isCompleted && (
          <button
            onClick={handleComplete}
            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Mark as complete (demo)
          </button>
        )}
      </div>
    </div>
  );
};
