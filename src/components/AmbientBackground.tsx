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
    // Storybook-style layered gradients with more depth
    const timeGradients = {
      morning: {
        sky: "from-purple-200/60 via-pink-100/50 to-orange-100/40",
        darkSky: "dark:from-purple-900/30 dark:via-pink-900/25 dark:to-orange-900/20",
      },
      afternoon: {
        sky: "from-cyan-200/50 via-blue-100/45 to-orange-100/40",
        darkSky: "dark:from-cyan-900/25 dark:via-blue-900/20 dark:to-orange-900/15",
      },
      evening: {
        sky: "from-indigo-300/50 via-purple-200/45 to-pink-200/40",
        darkSky: "dark:from-indigo-900/30 dark:via-purple-900/25 dark:to-pink-900/20",
      },
      night: {
        sky: "from-indigo-500/40 via-purple-400/35 to-blue-500/30",
        darkSky: "dark:from-indigo-950/35 dark:via-purple-950/30 dark:to-blue-950/25",
      },
    };

    const gradient = timeGradients[timeOfDay];
    return `${gradient.sky} ${gradient.darkSky}`;
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

      {/* Stars for night time */}
      {timeOfDay === "night" && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${(i * 13 + 7) % 95}%`,
                top: `${(i * 17 + 5) % 70}%`,
                opacity: 0.6,
                animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
