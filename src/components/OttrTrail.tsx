import { Waves, Anchor, Star, Trophy } from "lucide-react";

interface OttrTrailProps {
  progress: number; // 0-100
  level: number;
  milestones?: { position: number; icon: React.ReactNode; label: string }[];
}

export const OttrTrail = ({ progress, level, milestones = [] }: OttrTrailProps) => {
  const defaultMilestones = [
    { position: 25, icon: <Star className="w-4 h-4" />, label: "First Steps" },
    { position: 50, icon: <Trophy className="w-4 h-4" />, label: "Halfway" },
    { position: 75, icon: <Waves className="w-4 h-4" />, label: "Almost There" },
    { position: 100, icon: <Anchor className="w-4 h-4" />, label: "Rest Stop" },
  ];

  const displayMilestones = milestones.length > 0 ? milestones : defaultMilestones;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const isResting = clampedProgress >= 95;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-wiggle">🦦</span>
          <span className="text-sm font-bold text-foreground">Level {level} Trail</span>
        </div>
        <span className="text-sm font-semibold text-muted-foreground">
          {Math.round(clampedProgress)}% today
        </span>
      </div>

      {/* Ottr Trail Stream */}
      <div className="relative h-16 bg-gradient-to-r from-blue-100/20 via-blue-200/30 to-blue-100/20 dark:from-blue-900/10 dark:via-blue-800/20 dark:to-blue-900/10 rounded-full overflow-hidden border-2 border-blue-200/30 dark:border-blue-700/30">
        {/* Water waves background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/10 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
        
        {/* Progress water fill */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-300/30 via-blue-400/40 to-blue-300/30 dark:from-blue-600/20 dark:via-blue-500/30 dark:to-blue-600/20 transition-all duration-[2000ms] ease-out"
          style={{ width: `${clampedProgress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
        </div>

        {/* Milestones */}
        {displayMilestones.map((milestone, idx) => (
          <div
            key={idx}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-[2000ms]"
            style={{ left: `${milestone.position}%` }}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-[1500ms] ${
                clampedProgress >= milestone.position
                  ? "bg-primary border-primary text-primary-foreground shadow-[0_0_20px_rgba(147,51,234,0.4)] scale-110"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              {milestone.icon}
            </div>
            <div
              className={`absolute top-10 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap transition-opacity duration-[1000ms] ${
                clampedProgress >= milestone.position ? "opacity-100" : "opacity-50"
              }`}
            >
              {milestone.label}
            </div>
          </div>
        ))}

        {/* Swimming Ottr with water splash */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-[2000ms] ease-out z-10"
          style={{ left: `${clampedProgress}%` }}
        >
          <div className="relative">
            <div
              className={`text-3xl transition-all duration-[2000ms] ${
                isResting ? "animate-breathing" : "animate-wiggle"
              }`}
            >
              🦦
            </div>
            
            {/* Water splash trail when swimming */}
            {!isResting && clampedProgress > 5 && (
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-blue-400/40 text-sm animate-fade-in">
                💧
              </div>
            )}
            
            {/* Resting glow */}
            {isResting && (
              <>
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-glow-pulse" />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap animate-fade-in">
                  😴💤
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isResting && (
        <p className="text-center text-xs text-success font-medium animate-fade-in">
          Ottr is resting peacefully — you've earned it! 🌙
        </p>
      )}
    </div>
  );
};
