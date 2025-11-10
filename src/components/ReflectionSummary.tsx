import { Sparkles } from "lucide-react";

interface ReflectionSummaryProps {
  data: {
    sleep?: { hours: number; quality: number };
    energy?: number;
    mood?: number;
    reflection?: string;
  };
  caloriesConsumed: number;
  calorieGoal: number;
  waterCups: number;
  foodLogs: any[];
}

const qualityLabels = ["restless", "light", "restful"];
const energyLabels = ["low", "below average", "moderate", "good", "excellent"];
const moodLabels = ["down", "uncertain", "good", "great", "amazing"];

export const ReflectionSummary = ({ 
  data, 
  caloriesConsumed, 
  calorieGoal, 
  waterCups,
  foodLogs 
}: ReflectionSummaryProps) => {
  const { sleep, energy, mood, reflection } = data;

  // Generate contextual summary
  const generateSummary = () => {
    const parts = [];
    
    if (sleep) {
      parts.push(`You slept ${sleep.hours}h with ${qualityLabels[sleep.quality]} rest`);
    }
    
    if (energy !== undefined) {
      parts.push(`felt ${energyLabels[energy]} energy`);
    }

    if (mood !== undefined) {
      parts.push(`and are feeling ${moodLabels[mood]}`);
    }

    const caloriePercent = Math.round((caloriesConsumed / calorieGoal) * 100);
    if (caloriePercent >= 80 && caloriePercent <= 110) {
      parts.push(`Your nourishment was balanced today`);
    }

    if (waterCups >= 6) {
      parts.push(`stayed well hydrated`);
    }

    return parts.join(", ") + ".";
  };

  return (
    <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-background/40 border border-border/20 shadow-2xl p-8 space-y-6">
      {/* Ambient decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 animate-breathing" />
      
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Sparkles className="w-10 h-10 text-primary animate-pulse" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Reflection Complete
          </h2>
          <p className="text-sm text-muted-foreground italic">
            🦦 "You showed up for yourself today."
          </p>
        </div>

        {/* Summary */}
        <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-6 space-y-4 border border-border/30">
          <p className="text-base text-foreground leading-relaxed">
            {generateSummary()}
          </p>

          {reflection && (
            <div className="pt-4 border-t border-border/30">
              <p className="text-sm text-muted-foreground italic">
                "{reflection}"
              </p>
            </div>
          )}
        </div>

        {/* Affirmation */}
        <div className="text-center">
          <p className="text-sm text-primary/80 italic leading-relaxed">
            Rest easy. The tide will bring you back tomorrow.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {sleep && (
            <div className="bg-background/40 rounded-xl p-3 text-center border border-border/20">
              <div className="text-2xl font-bold text-foreground">{sleep.hours}h</div>
              <div className="text-xs text-muted-foreground">Sleep</div>
            </div>
          )}
          {energy !== undefined && (
            <div className="bg-background/40 rounded-xl p-3 text-center border border-border/20">
              <div className="text-2xl">
                {["😫", "😐", "🙂", "😊", "🤩"][energy]}
              </div>
              <div className="text-xs text-muted-foreground">Energy</div>
            </div>
          )}
          {mood !== undefined && (
            <div className="bg-background/40 rounded-xl p-3 text-center border border-border/20">
              <div className="text-2xl">
                {["😢", "😕", "😊", "😄", "🤗"][mood]}
              </div>
              <div className="text-xs text-muted-foreground">Mood</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
