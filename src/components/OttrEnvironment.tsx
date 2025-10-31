interface OttrEnvironmentProps {
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
}

export const OttrEnvironment = ({ timeOfDay }: OttrEnvironmentProps) => {
  // Environment element based on time of day
  const getEnvironmentStyle = () => {
    switch (timeOfDay) {
      case "morning":
        return {
          base: "from-stone-300/40 via-stone-200/30 to-stone-100/20",
          glow: "shadow-[0_8px_32px_rgba(251,146,60,0.3)]",
          accent: "bg-orange-200/20"
        };
      case "afternoon":
        return {
          base: "from-amber-200/35 via-yellow-100/25 to-amber-50/15",
          glow: "shadow-[0_8px_32px_rgba(251,191,36,0.25)]",
          accent: "bg-yellow-200/15"
        };
      case "evening":
        return {
          base: "from-indigo-300/30 via-purple-200/25 to-indigo-100/15",
          glow: "shadow-[0_8px_32px_rgba(129,140,248,0.3)]",
          accent: "bg-purple-200/15"
        };
      case "night":
        return {
          base: "from-slate-400/25 via-slate-300/20 to-slate-200/10",
          glow: "shadow-[0_8px_32px_rgba(191,219,254,0.35)]",
          accent: "bg-blue-200/20"
        };
    }
  };

  const style = getEnvironmentStyle();

  // Environment type based on time
  const getEnvironmentShape = () => {
    if (timeOfDay === "morning") {
      // Rock with sunrise lighting
      return (
        <div className="relative">
          <div 
            className={`w-40 h-20 rounded-[50%] bg-gradient-to-br ${style.base} ${style.glow} backdrop-blur-sm border border-white/20 transition-all duration-[3000ms]`}
            style={{
              transform: "perspective(400px) rotateX(12deg)",
            }}
          />
          {/* Sunrise glow */}
          <div className={`absolute inset-0 rounded-[50%] ${style.accent} blur-xl opacity-60 animate-breathing`} />
        </div>
      );
    } else if (timeOfDay === "afternoon") {
      // Driftwood / floating log
      return (
        <div className="relative">
          <div 
            className={`w-48 h-16 rounded-full bg-gradient-to-r ${style.base} ${style.glow} backdrop-blur-sm border border-white/20 transition-all duration-[3000ms]`}
            style={{
              transform: "perspective(400px) rotateX(8deg)",
              animation: "float-gentle 6s ease-in-out infinite"
            }}
          />
          {/* Water reflection */}
          <div className={`absolute inset-0 rounded-full ${style.accent} blur-lg opacity-40`} />
        </div>
      );
    } else if (timeOfDay === "evening" || timeOfDay === "night") {
      // Moonlit sandbar
      return (
        <div className="relative">
          <div 
            className={`w-44 h-18 rounded-[50%] bg-gradient-to-br ${style.base} ${style.glow} backdrop-blur-sm border border-white/30 transition-all duration-[3000ms]`}
            style={{
              transform: "perspective(400px) rotateX(10deg)",
            }}
          />
          {/* Moonlight glow */}
          <div 
            className={`absolute inset-0 rounded-[50%] ${style.accent} blur-2xl opacity-50`}
            style={{
              animation: "glow-pulse 4s ease-in-out infinite"
            }}
          />
        </div>
      );
    }
  };

  return (
    <div className="absolute left-1/2 -translate-x-1/2 z-0 pointer-events-none">
      {getEnvironmentShape()}
    </div>
  );
};
