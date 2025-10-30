import { Trophy, Star } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  emoji: string;
  earned: boolean;
  description: string;
}

interface SnackBadgeTrackerProps {
  badges: Badge[];
  dailyChallenge?: {
    flavor: string;
    emoji: string;
    progress: number;
    target: number;
  };
}

export const SnackBadgeTracker = ({ badges, dailyChallenge }: SnackBadgeTrackerProps) => {
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-2 border-border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Snack Mastery
        </h3>
        <span className="text-sm text-muted-foreground">
          {earnedCount}/{badges.length}
        </span>
      </div>

      {dailyChallenge && (
        <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-4 border-2 border-accent/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{dailyChallenge.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Today's Flavor: {dailyChallenge.flavor}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dailyChallenge.progress}/{dailyChallenge.target} logged
                </p>
              </div>
            </div>
            <Star className="w-5 h-5 text-accent animate-breathing" />
          </div>
          <div className="h-2 bg-background/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-[1500ms]"
              style={{
                width: `${(dailyChallenge.progress / dailyChallenge.target) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`relative group transition-all duration-[1500ms] ${
              badge.earned ? "scale-100" : "scale-95 opacity-60"
            }`}
          >
            <div
              className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 ${
                badge.earned
                  ? "bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/40 shadow-[0_4px_20px_rgba(147,51,234,0.2)]"
                  : "bg-card/50 border-2 border-border"
              }`}
            >
              {badge.emoji}
              {badge.earned && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-background">
                  <span className="text-xs">✓</span>
                </div>
              )}
            </div>
            {badge.earned && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                  {badge.name}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
