import { useState } from "react";
import { ReflectionCardBase } from "./ReflectionCardBase";
import { Button } from "@/components/ui/button";
import { Zap, Sun } from "lucide-react";

interface EnergyReflectionCardProps {
  onComplete: () => void;
  isCompleted: boolean;
}

const energyLevels = ["😫", "😐", "🙂", "😊", "🤩"];

export const EnergyReflectionCard = ({ onComplete, isCompleted }: EnergyReflectionCardProps) => {
  const [energy, setEnergy] = useState<number | null>(null);

  const handleComplete = () => {
    if (energy !== null) {
      onComplete();
    }
  };

  const decorativeScene = (
    <div className="absolute inset-0 flex items-center justify-center">
      <Sun className="w-24 h-24 text-secondary/30" />
      <Zap className="absolute bottom-16 right-16 w-8 h-8 text-accent/40" />
    </div>
  );

  return (
    <ReflectionCardBase
      decorativeScene={decorativeScene}
      promptText="How's your energy today?"
      gradientFrom="--secondary"
      gradientTo="--accent"
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            {energyLevels.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => setEnergy(idx)}
                className={`text-5xl ${
                  energy === idx
                    ? "scale-110"
                    : "scale-100 opacity-60"
                }`}
                style={{ padding: "8px" }}
              >
                {emoji}
              </button>
            ))}
          </div>
          {energy !== null && (
            <p className="text-center text-sm text-muted-foreground">
              {["Low", "Below Average", "Moderate", "Good", "Excellent"][energy]} energy
            </p>
          )}
        </div>

        <Button
          onClick={handleComplete}
          disabled={energy === null || isCompleted}
          className="w-full py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-secondary to-primary hover:shadow-lg transition-all"
        >
          {isCompleted ? "✓ Recorded" : "Continue"}
        </Button>
      </div>
    </ReflectionCardBase>
  );
};
