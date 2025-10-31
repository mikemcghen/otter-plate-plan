interface OceanWavesProps {
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
}

export const OceanWaves = ({ timeOfDay }: OceanWavesProps) => {
  // Wave colors based on time of day
  const waveColors = {
    morning: {
      primary: "rgba(167, 139, 250, 0.3)",
      secondary: "rgba(251, 146, 60, 0.2)",
      accent: "rgba(255, 255, 255, 0.4)"
    },
    afternoon: {
      primary: "rgba(96, 165, 250, 0.3)",
      secondary: "rgba(251, 146, 60, 0.25)",
      accent: "rgba(255, 255, 255, 0.35)"
    },
    evening: {
      primary: "rgba(129, 140, 248, 0.35)",
      secondary: "rgba(167, 139, 250, 0.3)",
      accent: "rgba(255, 255, 255, 0.3)"
    },
    night: {
      primary: "rgba(99, 102, 241, 0.25)",
      secondary: "rgba(139, 92, 246, 0.2)",
      accent: "rgba(191, 219, 254, 0.25)"
    }
  };

  const colors = waveColors[timeOfDay];

  return (
    <div className="relative w-full h-32 overflow-hidden">
      {/* Wave Layer 1 - Main wave */}
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.primary, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colors.primary, stopOpacity: 0.3 }} />
          </linearGradient>
          <filter id="wave-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
          </filter>
        </defs>
        
        <path
          fill="url(#wave-gradient-1)"
          d="M0,40 Q360,10 720,40 T1440,40 L1440,120 L0,120 Z"
          style={{
            filter: "url(#wave-blur)"
          }}
        >
          <animate
            attributeName="d"
            dur="7s"
            repeatCount="indefinite"
            values="
              M0,40 Q360,10 720,40 T1440,40 L1440,120 L0,120 Z;
              M0,30 Q360,50 720,30 T1440,30 L1440,120 L0,120 Z;
              M0,40 Q360,10 720,40 T1440,40 L1440,120 L0,120 Z
            "
          />
        </path>
      </svg>

      {/* Wave Layer 2 - Secondary wave (offset) */}
      <svg
        className="absolute bottom-0 left-0 w-full h-full opacity-70"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.secondary, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colors.secondary, stopOpacity: 0.2 }} />
          </linearGradient>
        </defs>
        
        <path
          fill="url(#wave-gradient-2)"
          d="M0,60 Q360,80 720,60 T1440,60 L1440,120 L0,120 Z"
        >
          <animate
            attributeName="d"
            dur="5s"
            repeatCount="indefinite"
            values="
              M0,60 Q360,80 720,60 T1440,60 L1440,120 L0,120 Z;
              M0,70 Q360,50 720,70 T1440,70 L1440,120 L0,120 Z;
              M0,60 Q360,80 720,60 T1440,60 L1440,120 L0,120 Z
            "
          />
        </path>
      </svg>

      {/* Wave Layer 3 - Accent highlights (shimmer) */}
      <svg
        className="absolute bottom-0 left-0 w-full h-full opacity-50"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="none"
          stroke={colors.accent}
          strokeWidth="1.5"
          d="M0,45 Q360,15 720,45 T1440,45"
          opacity="0.6"
        >
          <animate
            attributeName="d"
            dur="6s"
            repeatCount="indefinite"
            values="
              M0,45 Q360,15 720,45 T1440,45;
              M0,35 Q360,55 720,35 T1440,35;
              M0,45 Q360,15 720,45 T1440,45
            "
          />
          <animate
            attributeName="opacity"
            dur="3s"
            repeatCount="indefinite"
            values="0.6;0.8;0.6"
          />
        </path>
      </svg>

      {/* Reflection shimmer */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${colors.accent} 50%, transparent 100%)`,
          animation: "wave-shimmer 4s ease-in-out infinite"
        }}
      />
    </div>
  );
};
