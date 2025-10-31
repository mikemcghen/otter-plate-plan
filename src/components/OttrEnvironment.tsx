import { useEffect, useState } from "react";

interface OttrEnvironmentProps {
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  className?: string;
}

export const OttrEnvironment = ({ timeOfDay, className = "" }: OttrEnvironmentProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getEnvironmentColors = () => {
    switch (timeOfDay) {
      case "morning":
        return {
          surface: "linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(251, 113, 133, 0.1) 100%)",
          highlight: "rgba(254, 243, 199, 0.4)",
          shadow: "rgba(124, 58, 237, 0.15)",
        };
      case "afternoon":
        return {
          surface: "linear-gradient(135deg, rgba(96, 165, 250, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)",
          highlight: "rgba(255, 255, 255, 0.35)",
          shadow: "rgba(79, 70, 229, 0.12)",
        };
      case "evening":
        return {
          surface: "linear-gradient(135deg, rgba(129, 140, 248, 0.15) 0%, rgba(109, 40, 217, 0.1) 100%)",
          highlight: "rgba(196, 181, 253, 0.3)",
          shadow: "rgba(55, 48, 163, 0.18)",
        };
      case "night":
        return {
          surface: "linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(109, 40, 217, 0.15) 100%)",
          highlight: "rgba(147, 197, 253, 0.25)",
          shadow: "rgba(30, 27, 75, 0.25)",
        };
    }
  };

  const colors = getEnvironmentColors();

  return (
    <div 
      className={`relative flex items-center justify-center transition-opacity duration-1000 ${className}`}
      style={{ opacity: mounted ? 1 : 0 }}
    >
      {/* Environment platform - rock/shell */}
      <div className="relative">
        {/* Shadow below platform */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-28 h-6 rounded-full blur-xl transition-all duration-[3000ms]"
          style={{
            background: colors.shadow,
            opacity: 0.6,
          }}
        />

        {/* Main platform */}
        <div
          className="relative w-32 h-14 rounded-[50%] transition-all duration-[3000ms]"
          style={{
            background: colors.surface,
            boxShadow: `
              inset 0 2px 8px ${colors.shadow},
              0 4px 12px ${colors.shadow}
            `,
          }}
        >
          {/* Surface texture - subtle highlights */}
          <div
            className="absolute inset-0 rounded-[50%]"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, ${colors.highlight} 0%, transparent 60%)`,
            }}
          />
          
          {/* Edge highlight */}
          <div
            className="absolute bottom-0 left-0 right-0 h-3 rounded-b-[50%]"
            style={{
              background: `linear-gradient(to bottom, transparent 0%, ${colors.shadow} 100%)`,
              opacity: 0.4,
            }}
          />
        </div>

        {/* Small decorative elements (shells/pebbles) based on time */}
        {timeOfDay === "morning" && (
          <div
            className="absolute -right-4 top-2 w-3 h-3 rounded-full animate-breathing"
            style={{
              background: "radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(251, 146, 60, 0.2) 100%)",
            }}
          />
        )}
        {(timeOfDay === "evening" || timeOfDay === "night") && (
          <div
            className="absolute -left-3 top-1 w-2 h-2 rounded-full animate-twinkle"
            style={{
              background: "radial-gradient(circle, rgba(147, 197, 253, 0.6) 0%, rgba(59, 130, 246, 0.3) 100%)",
              animationDelay: "1s",
            }}
          />
        )}
      </div>
    </div>
  );
};
