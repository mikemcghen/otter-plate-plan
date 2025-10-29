import { Flame } from "lucide-react";

interface StreakCounterProps {
  days: number;
}

export const StreakCounter = ({ days }: StreakCounterProps) => {
  return (
    <div className="group relative flex items-center gap-2 bg-gradient-to-r from-streak/15 to-streak/25 dark:from-streak/20 dark:to-streak/30 px-4 py-2 rounded-full border-2 border-streak/40 transition-all duration-300 hover:border-streak/60 hover:shadow-lg hover:shadow-streak/20">
      <Flame className="w-5 h-5 text-streak animate-bounce-subtle group-hover:scale-110 transition-transform" />
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-streak leading-none transition-all duration-300 group-hover:scale-105">
          {days}
        </span>
        <span className="text-xs font-semibold text-foreground -mt-0.5">day streak</span>
      </div>
      {/* Milestone indicator */}
      {days > 0 && days % 7 === 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-success text-success-foreground rounded-full flex items-center justify-center text-xs animate-bounce-subtle">
          ✨
        </div>
      )}
    </div>
  );
};
