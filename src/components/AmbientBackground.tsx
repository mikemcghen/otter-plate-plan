import { useEffect, useState } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";

interface AmbientBackgroundProps {
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  progressPercentage: number;
}

export const AmbientBackground = ({ timeOfDay, progressPercentage }: AmbientBackgroundProps) => {
  const { dashboardTheme } = useThemeContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getGradient = () => {
    const isHighProgress = progressPercentage >= 80;

    // Theme-specific color adjustments
    const themeColors = {
      "fresh-start": {
        morning: "from-purple-100/40 via-coral-100/30 to-purple-50/20",
        afternoon: "from-purple-200/50 via-purple-100/40 to-blue-100/30",
        evening: "from-blue-200/40 via-purple-100/30 to-indigo-100/20",
        night: "from-indigo-900/30 via-purple-900/20 to-slate-900/10",
      },
      "encouraging-energy": {
        morning: "from-purple-200/60 via-pink-100/50 to-orange-100/40",
        afternoon: "from-purple-300/60 via-pink-200/50 to-purple-200/40",
        evening: "from-purple-300/50 via-blue-200/40 to-purple-200/30",
        night: "from-purple-800/40 via-indigo-900/30 to-purple-900/20",
      },
      "reflective-calm": {
        morning: "from-blue-100/30 via-purple-50/20 to-slate-100/15",
        afternoon: "from-blue-200/35 via-purple-100/25 to-blue-100/20",
        evening: "from-blue-300/40 via-slate-200/30 to-blue-200/25",
        night: "from-slate-800/30 via-blue-900/20 to-slate-900/15",
      },
    };

    const baseGradient = themeColors[dashboardTheme][timeOfDay];
    
    // Add warm glow when high progress
    if (isHighProgress) {
      return `${baseGradient} dark:from-purple-900/20 dark:via-orange-900/15 dark:to-purple-800/10`;
    }
    
    return `${baseGradient} dark:from-slate-900/30 dark:via-purple-900/15 dark:to-slate-900/20`;
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient layer */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br transition-all duration-[6000ms] ease-in-out ${getGradient()}`}
        style={{ opacity: mounted ? 1 : 0 }}
      />

      {/* Ambient motion layer 1: Pulsing light */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${50 + Math.sin(Date.now() / 5000) * 10}% ${50 + Math.cos(Date.now() / 5000) * 10}%, rgba(167, 139, 250, 0.15) 0%, transparent 60%)`,
          animation: "breathing 4s ease-in-out infinite",
        }}
      />

      {/* Ambient motion layer 2: Floating objects */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${(i * 20 + 10)}%`,
              top: `${(i * 15 + 5)}%`,
              animation: `float-drift ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
            }}
          >
            {timeOfDay === "morning" && "🌊"}
            {timeOfDay === "afternoon" && "🐚"}
            {timeOfDay === "evening" && "✨"}
            {timeOfDay === "night" && "🌙"}
          </div>
        ))}
      </div>

      {/* Ambient motion layer 3: Water ripples */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(139, 92, 246, 0.03) 50px, rgba(139, 92, 246, 0.03) 52px)`,
          animation: "ripple-slow 8s linear infinite",
        }}
      />
    </div>
  );
};
