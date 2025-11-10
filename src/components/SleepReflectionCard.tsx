import { useState } from "react";
import { ReflectionCardBase } from "./ReflectionCardBase";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Moon, Star } from "lucide-react";

interface SleepReflectionCardProps {
  onComplete: () => void;
  isCompleted: boolean;
}

const sleepQuality = ["😴", "😪", "😌"];

export const SleepReflectionCard = ({ onComplete, isCompleted }: SleepReflectionCardProps) => {
  const [hours, setHours] = useState([7]);
  const [quality, setQuality] = useState<number | null>(null);

  const handleComplete = () => {
    if (quality !== null) {
      onComplete();
    }
  };

  const decorativeScene = (
    <div className="absolute inset-0 flex items-center justify-center">
      <Moon className="w-20 h-20 text-primary/30" />
      <Star className="absolute top-8 right-12 w-6 h-6 text-accent/40" />
      <Star className="absolute top-16 left-16 w-4 h-4 text-accent/40" />
      <Star className="absolute bottom-12 right-20 w-5 h-5 text-accent/40" />
    </div>
  );

  return (
    <ReflectionCardBase
      decorativeScene={decorativeScene}
      promptText="How did you sleep last night?"
      gradientFrom="--primary"
      gradientTo="--accent"
    >
      <div className="space-y-8">
        {/* Hours Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Hours slept</span>
            <span className="text-2xl font-bold text-foreground">{hours[0]}h</span>
          </div>
          <Slider
            value={hours}
            onValueChange={setHours}
            min={3}
            max={12}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Quality Emoji Selector */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">How did it feel?</p>
          <div className="flex justify-center gap-6">
            {sleepQuality.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => setQuality(idx)}
                className={`text-5xl ${
                  quality === idx
                    ? "scale-110"
                    : "scale-100 opacity-60"
                }`}
                style={{ padding: "8px" }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Complete Button */}
        <Button
          onClick={handleComplete}
          disabled={quality === null || isCompleted}
          className="w-full py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all"
        >
          {isCompleted ? "✓ Recorded" : "Continue"}
        </Button>
      </div>
    </ReflectionCardBase>
  );
};
