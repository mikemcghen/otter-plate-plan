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

    // Living Cove: Ocean-in-a-cave gradients (deeper, more immersive)
    const timeGradients = {
      morning: {
        base: "from-purple-300/40 via-orange-200/35 to-pink-200/30",
        dark: "dark:from-purple-900/35 dark:via-indigo-900/30 dark:to-purple-800/25",
        accent: isHighProgress ? "from-amber-300/20" : "",
      },
      afternoon: {
        base: "from-cyan-200/35 via-blue-200/30 to-purple-200/25",
        dark: "dark:from-blue-900/30 dark:via-cyan-900/25 dark:to-indigo-800/20",
        accent: isHighProgress ? "from-sky-300/15" : "",
      },
      evening: {
        base: "from-indigo-300/40 via-purple-300/35 to-blue-400/30",
        dark: "dark:from-indigo-900/35 dark:via-purple-900/30 dark:to-blue-900/25",
        accent: isHighProgress ? "from-violet-300/20" : "",
      },
      night: {
        base: "from-indigo-400/30 via-purple-400/25 to-slate-400/20",
        dark: "dark:from-indigo-950/40 dark:via-purple-950/35 dark:to-slate-950/30",
        accent: isHighProgress ? "from-blue-400/15" : "",
      },
    };

    const gradient = timeGradients[timeOfDay];
    return `${gradient.base} ${gradient.dark} ${gradient.accent}`;
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient layer - Ocean-in-a-cave */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br transition-all duration-[6000ms] ease-in-out ${getGradient()}`}
        style={{ opacity: mounted ? 1 : 0 }}
      />

      {/* Light rays from above */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: timeOfDay === "morning" 
            ? "radial-gradient(ellipse at 50% 0%, rgba(251, 146, 60, 0.25) 0%, transparent 60%)"
            : timeOfDay === "afternoon"
            ? "radial-gradient(ellipse at 50% 0%, rgba(96, 165, 250, 0.2) 0%, transparent 60%)"
            : timeOfDay === "evening"
            ? "radial-gradient(ellipse at 50% 0%, rgba(129, 140, 248, 0.25) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 50% 0%, rgba(147, 197, 253, 0.15) 0%, transparent 60%)",
          animation: "breathing 8s ease-in-out infinite",
        }}
      />

      {/* Twinkling stars (night only) */}
      {timeOfDay === "night" && (
        <div className="absolute inset-0 overflow-hidden opacity-60">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-blue-100 animate-twinkle"
              style={{
                left: `${(i * 13 + 10)}%`,
                top: `${(i * 7 + 5)}%`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}

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
