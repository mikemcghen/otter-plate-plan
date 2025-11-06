import { useState } from "react";
import { ReflectionCardBase } from "./ReflectionCardBase";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";

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

  const decorativeScene = (
    <div className="absolute inset-0 flex items-center justify-center">
      <Heart className="w-20 h-20 text-primary/30 animate-pulse" />
      <Sparkles className="absolute top-12 right-16 w-8 h-8 text-accent/40 animate-twinkle" />
      <Sparkles className="absolute bottom-12 left-16 w-6 h-6 text-accent/40 animate-twinkle delay-300" />
    </div>
  );

  return (
    <ReflectionCardBase
      decorativeScene={decorativeScene}
      promptText="How are you feeling?"
      gradientFrom="--accent"
      gradientTo="--primary"
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center gap-3">
            {moods.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setMood(idx)}
                className={`flex flex-col items-center transition-all duration-200 ${
                  mood === idx
                    ? "scale-110 animate-float"
                    : "scale-100 opacity-60 hover:opacity-100 hover:scale-105"
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
    </ReflectionCardBase>
  );
};
