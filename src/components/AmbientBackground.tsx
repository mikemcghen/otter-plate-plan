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

    // Enhanced time-of-day gradients (more vivid, better contrast)
    const timeGradients = {
      morning: {
        base: "from-purple-200/50 via-orange-100/40 to-pink-100/30",
        dark: "dark:from-purple-900/25 dark:via-orange-900/20 dark:to-purple-800/15",
      },
      afternoon: {
        base: "from-blue-100/40 via-purple-100/35 to-blue-200/30",
        dark: "dark:from-blue-900/20 dark:via-purple-900/15 dark:to-blue-800/10",
      },
      evening: {
        base: "from-indigo-200/45 via-purple-200/40 to-blue-300/35",
        dark: "dark:from-indigo-900/25 dark:via-purple-900/20 dark:to-blue-900/15",
      },
      night: {
        base: "from-indigo-300/35 via-purple-300/30 to-slate-300/25",
        dark: "dark:from-indigo-950/30 dark:via-purple-950/25 dark:to-slate-950/20",
      },
    };

    const gradient = timeGradients[timeOfDay];
    
    // Add warm glow when high progress
    if (isHighProgress) {
      return `${gradient.base} ${gradient.dark}`;
    }
    
    return `${gradient.base} ${gradient.dark}`;
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
        className="absolute inset-0 opacity-25"
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(167, 139, 250, 0.12) 0%, transparent 65%)`,
          animation: "breathing 5s ease-in-out infinite",
        }}
      />

      {/* Ambient motion layer 2: Floating bubbles/elements */}
      <div className="absolute inset-0 overflow-hidden opacity-15">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-12 h-12 rounded-full"
            style={{
              left: `${(i * 30 + 15)}%`,
              top: `${(i * 25 + 10)}%`,
              background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
              animation: `float-drift ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 1.2}s`,
              filter: "blur(20px)",
            }}
          />
        ))}
      </div>

      {/* Ambient motion layer 3: Gentle shimmer wave */}
      <div 
        className="absolute inset-0 opacity-8"
        style={{
          background: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)`,
          animation: "wave-flow 8s ease-in-out infinite",
          backgroundSize: "200% 200%",
        }}
      />
    </div>
  );
};
