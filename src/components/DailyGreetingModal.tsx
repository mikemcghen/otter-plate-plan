import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OtterMascot, OtterMood } from "@/components/OtterMascot";
import { Flame, Sparkles } from "lucide-react";
import { useHaptics } from "@/hooks/useHaptics";

interface DailyGreetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streak: number;
  onStart: () => void;
}

export const DailyGreetingModal = ({
  open,
  onOpenChange,
  streak,
  onStart,
}: DailyGreetingModalProps) => {
  const { impact } = useHaptics();
  const currentHour = new Date().getHours();

  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getMessage = () => {
    if (streak === 0) {
      return "Welcome back, Ottr missed you! Let's start fresh today.";
    }
    if (streak >= 7) {
      return `You're on a ${streak}-day streak! Consistency champion! 🏆`;
    }
    return `${streak}-day streak going strong! Keep it up, swimmer! 🦦`;
  };

  const getMood = (): OtterMood => {
    if (streak === 0) return "encouraging";
    if (streak >= 7) return "proud";
    return "happy";
  };

  const handleStart = async () => {
    await impact();
    onStart();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl border-2 border-border p-8">
        <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
          <OtterMascot mood={getMood()} animate={true} />

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {getGreeting()}, swimmer! 👋
            </h2>
            <p className="text-base text-muted-foreground">
              {getMessage()}
            </p>
          </div>

          {streak > 0 && (
            <div className="flex items-center gap-3 bg-gradient-to-r from-streak/15 to-streak/25 px-6 py-3 rounded-full border-2 border-streak/40">
              <Flame className="w-6 h-6 text-streak" />
              <div className="text-left">
                <div className="text-2xl font-bold text-streak">{streak}</div>
                <div className="text-xs font-semibold text-foreground -mt-1">
                  day streak
                </div>
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="w-full h-12 rounded-2xl active:scale-95 transition-transform"
            onClick={handleStart}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start My Day
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
