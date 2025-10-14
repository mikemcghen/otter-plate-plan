import { Flame } from "lucide-react";

interface StreakCounterProps {
  days: number;
}

export const StreakCounter = ({ days }: StreakCounterProps) => {
  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-streak/15 to-streak/25 dark:from-streak/20 dark:to-streak/30 px-4 py-2 rounded-full border-2 border-streak/40">
      <Flame className="w-5 h-5 text-streak animate-bounce-subtle" />
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-streak leading-none">{days}</span>
        <span className="text-xs font-semibold text-foreground -mt-0.5">day streak</span>
      </div>
    </div>
  );
};
