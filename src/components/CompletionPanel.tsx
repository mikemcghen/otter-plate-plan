import { useEffect, useState } from "react";
import { OtterMascot } from "./OtterMascot";
import { StreakCounter } from "./StreakCounter";
import { useAppContext } from "@/contexts/AppContext";
import { Confetti } from "./Confetti";
import { XPGainAnimation } from "./XPGainAnimation";

export const CompletionPanel = () => {
  const { streak, xp } = useAppContext();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showXP, setShowXP] = useState(true);

  useEffect(() => {
    const confettiTimer = setTimeout(() => setShowConfetti(false), 4000);
    const xpTimer = setTimeout(() => setShowXP(false), 3000);
    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(xpTimer);
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-6 relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 animate-twilight">
      {showConfetti && <Confetti active={true} />}
      {showXP && <XPGainAnimation amount={50} />}

      <div className="space-y-8 flex flex-col items-center animate-fade-in">
        {/* Ottr Floating on Wave */}
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-gradient-to-br from-primary/30 to-accent/30 rounded-full animate-breathing" />
          <OtterMascot 
            mood="happy" 
            message="" 
            className="scale-150 animate-float"
          />
        </div>

        {/* Completion Message */}
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            You did great today! 🦦
          </h1>
          <p className="text-lg text-muted-foreground max-w-sm">
            Rest easy. The tide will bring you back tomorrow.
          </p>
        </div>

        {/* Updated Streak */}
        <div className="scale-125">
          <StreakCounter days={streak} />
        </div>

        {/* XP Summary */}
        <div className="bg-background/60 backdrop-blur-md border border-border/40 rounded-3xl px-8 py-4 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Daily XP Earned</span>
            <span className="text-2xl font-bold text-primary">+50</span>
          </div>
        </div>
      </div>
    </div>
  );
};
