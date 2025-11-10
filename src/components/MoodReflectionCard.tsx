import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MoodReflectionCardProps {
  onComplete: () => void;
  isCompleted: boolean;
}

const moods = [
  { emoji: "😢", label: "Down" },
  { emoji: "😕", label: "Meh" },
  { emoji: "😊", label: "Good" },
  { emoji: "😄", label: "Great" },
  { emoji: "🤗", label: "Amazing" },
];

export const MoodReflectionCard = ({ onComplete, isCompleted }: MoodReflectionCardProps) => {
  const [mood, setMood] = useState<number | null>(null);

  const handleComplete = () => {
    if (mood !== null) {
      onComplete();
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center text-foreground">
        How are you feeling?
      </h2>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center gap-3">
            {moods.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setMood(idx)}
                className={`flex flex-col items-center ${
                  mood === idx
                    ? "scale-110"
                    : "scale-100 opacity-60"
                }`}
                style={{ padding: "8px" }}
              >
                <span className="text-4xl">{m.emoji}</span>
                <span className="text-xs text-muted-foreground mt-1">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleComplete}
          disabled={mood === null || isCompleted}
          className="w-full py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-accent to-secondary hover:shadow-lg transition-all"
        >
          {isCompleted ? "✓ Recorded" : "Continue"}
        </Button>
      </div>
    </div>
  );
};
