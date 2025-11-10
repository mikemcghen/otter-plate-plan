import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface MoodReflectionCardProps {
  onComplete: (data: number) => void;
  data?: number;
  waterCups: number;
}

const moods = [
  { emoji: "😢", label: "Down" },
  { emoji: "😕", label: "Meh" },
  { emoji: "😊", label: "Good" },
  { emoji: "😄", label: "Great" },
  { emoji: "🤗", label: "Amazing" },
];

const getInsight = (mood: number, waterCups: number) => {
  if (mood >= 3) return "You're feeling calm today — a quiet strength.";
  if (mood <= 1 && waterCups < 4) return "A gentle nudge — more water before evening helps balance.";
  if (mood === 2) return "Steady as a river — your consistency shines.";
  return "Every feeling is valid — Ottr's here with you.";
};

export const MoodReflectionCard = ({ onComplete, data, waterCups }: MoodReflectionCardProps) => {
  const [mood, setMood] = useState<number | null>(data ?? null);
  const [insight, setInsight] = useState("");
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    if (mood !== null) {
      setShowInsight(false);
      const timer = setTimeout(() => {
        setInsight(getInsight(mood, waterCups));
        setShowInsight(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [mood, waterCups]);

  const handleComplete = () => {
    if (mood !== null) {
      onComplete(mood);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Decorative ambient */}
      <div className="flex justify-center mb-2">
        <Heart className="w-8 h-8 text-secondary/40 animate-pulse" strokeWidth={1.5} />
      </div>

      <h2 className="text-xl font-semibold text-center text-foreground tracking-tight">
        How are you feeling?
      </h2>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center gap-3">
            {moods.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setMood(idx)}
                className={`flex flex-col items-center transition-all duration-200 ${
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

        {/* Insight */}
        {showInsight && (
          <p className="text-sm italic text-secondary/80 text-center animate-fade-in px-4 leading-relaxed">
            {insight}
          </p>
        )}

        <Button
          onClick={handleComplete}
          disabled={mood === null}
          className="w-full py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-accent to-secondary hover:shadow-lg transition-all disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
