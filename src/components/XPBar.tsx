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
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Level {level}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {current}/{max} XP
        </span>
      </div>
      <div className="relative">
        <Progress value={percentage} className="h-3" />
      </div>
    </div>
  );
};
