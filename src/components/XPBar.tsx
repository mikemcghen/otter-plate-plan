import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

interface XPBarProps {
  current: number;
  max: number;
  level?: number;
}

export const XPBar = ({ current, max, level = 1 }: XPBarProps) => {
  const percentage = (current / max) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold text-foreground">Level {level}</span>
        </div>
        <span className="text-sm font-semibold text-muted-foreground">
          {current}/{max} XP
        </span>
      </div>
      <div className="relative overflow-hidden">
        <Progress value={percentage} className="h-3" />
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]"
          style={{
            backgroundSize: "200% 100%",
          }}
        />
      </div>
    </div>
  );
};
