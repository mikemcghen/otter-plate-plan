import { useEffect, useState } from "react";

interface OceanWavesProps {
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
}

export const OceanWaves = ({ timeOfDay }: OceanWavesProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getWaveColors = () => {
    switch (timeOfDay) {
      case "morning":
        return {
          primary: "rgba(139, 92, 246, 0.2)", // Purple
          secondary: "rgba(251, 146, 60, 0.15)", // Orange
          tertiary: "rgba(167, 139, 250, 0.1)",
        };
      case "afternoon":
        return {
          primary: "rgba(59, 130, 246, 0.2)", // Blue
          secondary: "rgba(139, 92, 246, 0.15)", // Purple
          tertiary: "rgba(96, 165, 250, 0.1)",
        };
      case "evening":
        return {
          primary: "rgba(99, 102, 241, 0.2)", // Indigo
          secondary: "rgba(139, 92, 246, 0.15)", // Purple
          tertiary: "rgba(129, 140, 248, 0.1)",
        };
      case "night":
        return {
          primary: "rgba(79, 70, 229, 0.25)", // Deep indigo
          secondary: "rgba(99, 102, 241, 0.2)",
          tertiary: "rgba(109, 40, 217, 0.15)",
        };
    }
  };

  const colors = getWaveColors();

  return (
    <div 
      className="absolute left-0 right-0 pointer-events-none overflow-hidden transition-opacity duration-1000"
      style={{ 
        bottom: "180px", // Positioned above Daily Focus section
        height: "120px",
        opacity: mounted ? 1 : 0,
      }}
    >
      {/* Wave layer 1 - Back */}
      <svg
        className="absolute bottom-0 w-full"
        style={{
          height: "80px",
          animation: "wave-flow 7s ease-in-out infinite",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
      >
        <path
          d="M0,40 C240,20 480,60 720,40 C960,20 1200,60 1440,40 L1440,100 L0,100 Z"
          fill={colors.tertiary}
          opacity="0.6"
        />
      </svg>

      {/* Wave layer 2 - Middle */}
      <svg
        className="absolute bottom-0 w-full"
        style={{
          height: "70px",
          animation: "wave-flow 5s ease-in-out infinite",
          animationDelay: "0.5s",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
      >
        <path
          d="M0,50 C240,70 480,30 720,50 C960,70 1200,30 1440,50 L1440,100 L0,100 Z"
          fill={colors.secondary}
          opacity="0.7"
        />
      </svg>

      {/* Wave layer 3 - Front */}
      <svg
        className="absolute bottom-0 w-full"
        style={{
          height: "60px",
          animation: "wave-flow 6s ease-in-out infinite",
          animationDelay: "1s",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
      >
        <path
          d="M0,60 C240,40 480,80 720,60 C960,40 1200,80 1440,60 L1440,100 L0,100 Z"
          fill={colors.primary}
          opacity="0.8"
        />
      </svg>

      {/* Subtle shimmer effect */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)`,
          backgroundSize: "200% 100%",
          animation: "shimmer-horizontal 8s linear infinite",
          opacity: 0.3,
        }}
      />
    </div>
  );
};
