import { useState } from "react";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="w-full p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center text-foreground">
        How's your energy today?
      </h2>

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
    </div>
  );
};
