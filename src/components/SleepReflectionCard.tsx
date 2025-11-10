import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";

interface SleepReflectionCardProps {
  onComplete: (data: { hours: number; quality: number }) => void;
  data?: { hours: number; quality: number };
}

const sleepQuality = ["😴", "😪", "😌"];

const getInsight = (hours: number, quality: number) => {
  if (hours >= 7 && quality === 2) return "You feel most focused after 7h of rest — a steady rhythm.";
  if (hours < 6) return "Even light rest counts — take it easy today.";
  if (hours >= 8) return "Deep rest is your foundation — you're building strength.";
  return "Sleep is when your body tells its story — listen closely.";
};

export const SleepReflectionCard = ({ onComplete, data }: SleepReflectionCardProps) => {
  const [hours, setHours] = useState([data?.hours || 7]);
  const [quality, setQuality] = useState<number | null>(data?.quality ?? null);
  const [insight, setInsight] = useState("");
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    if (quality !== null) {
      setShowInsight(false);
      const timer = setTimeout(() => {
        setInsight(getInsight(hours[0], quality));
        setShowInsight(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [quality, hours]);

  const handleComplete = () => {
    if (quality !== null) {
      onComplete({ hours: hours[0], quality });
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Decorative ambient */}
      <div className="flex justify-center mb-2">
        <Moon className="w-8 h-8 text-primary/40 animate-pulse" strokeWidth={1.5} />
      </div>

      <h2 className="text-xl font-semibold text-center text-foreground tracking-tight">
        How did you sleep last night?
      </h2>

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
                className={`text-5xl transition-all duration-200 ${
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

        {/* Insight */}
        {showInsight && (
          <p className="text-sm italic text-primary/80 text-center animate-fade-in px-4 leading-relaxed">
            {insight}
          </p>
        )}

        {/* Complete Button */}
        <Button
          onClick={handleComplete}
          disabled={quality === null}
          className="w-full py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
