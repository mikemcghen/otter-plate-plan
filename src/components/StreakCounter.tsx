import { Flame } from "lucide-react";

interface StreakCounterProps {
  days: number;
}

export const StreakCounter = ({ days }: StreakCounterProps) => {
  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-streak/10 to-streak/20 px-4 py-2 rounded-full border border-streak/30">
      <Flame className="w-5 h-5 text-streak animate-bounce-subtle" />
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-streak">{days}</span>
        <span className="text-xs text-muted-foreground -mt-1">day streak</span>
      </div>
    </div>
  );
};
