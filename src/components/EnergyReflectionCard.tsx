import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface EnergyReflectionCardProps {
  onComplete: (data: number) => void;
  data?: number;
  recentFoodTags: string[];
}

const energyLevels = ["😫", "😐", "🙂", "😊", "🤩"];

const getInsight = (energy: number, recentFoodTags: string[]) => {
  const hasFruit = recentFoodTags.some(tag => tag.toLowerCase().includes("fruit") || tag.toLowerCase().includes("apple") || tag.toLowerCase().includes("banana"));
  
  if (energy >= 3 && hasFruit) return "Your energy often peaks when breakfast includes fruit.";
  if (energy >= 4) return "You moved with momentum today.";
  if (energy <= 1) return "Low energy is a signal, not a flaw — honor where you are.";
  return "Energy ebbs and flows like the tide — you're right on rhythm.";
};

export const EnergyReflectionCard = ({ onComplete, data, recentFoodTags }: EnergyReflectionCardProps) => {
  const [energy, setEnergy] = useState<number | null>(data ?? null);
  const [insight, setInsight] = useState("");
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    if (energy !== null) {
      setShowInsight(false);
      const timer = setTimeout(() => {
        setInsight(getInsight(energy, recentFoodTags));
        setShowInsight(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [energy, recentFoodTags]);

  const handleComplete = () => {
    if (energy !== null) {
      onComplete(energy);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Decorative ambient */}
      <div className="flex justify-center mb-2">
        <Zap className="w-8 h-8 text-accent/40 animate-pulse" strokeWidth={1.5} />
      </div>

      <h2 className="text-xl font-semibold text-center text-foreground tracking-tight">
        How's your energy today?
      </h2>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            {energyLevels.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => setEnergy(idx)}
                className={`text-5xl transition-all duration-200 ${
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

        {/* Insight */}
        {showInsight && (
          <p className="text-sm italic text-accent/80 text-center animate-fade-in px-4 leading-relaxed">
            {insight}
          </p>
        )}

        <Button
          onClick={handleComplete}
          disabled={energy === null}
          className="w-full py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-secondary to-primary hover:shadow-lg transition-all disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
