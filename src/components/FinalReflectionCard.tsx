import { useState, useEffect } from "react";
import { Sparkles, Moon, Footprints, Droplet, Target, UtensilsCrossed } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "./CircularProgress";

interface FinalReflectionCardProps {
  onComplete: (data: string) => void;
  data?: string;
  reflectionData: any;
  caloriesConsumed: number;
  calorieGoal: number;
  waterCups: number;
  movementMinutes: number;
  streak: number;
}

const prompts = [
  "What are you grateful for?",
  "What felt good today?",
  "What helped you recharge?",
  "What brought you joy today?",
  "What made you feel calm?"
];

interface Insight {
  icon: any;
  text: string;
  visible: boolean;
}

export const FinalReflectionCard = ({
  onComplete,
  data = "",
  reflectionData,
  caloriesConsumed,
  calorieGoal,
  waterCups,
  movementMinutes,
  streak
}: FinalReflectionCardProps) => {
  const [reflection, setReflection] = useState(data);
  const [prompt] = useState(() => prompts[Math.floor(Math.random() * prompts.length)]);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    // Generate insights based on user data
    const generatedInsights: Insight[] = [];

    // Sleep insight
    if (reflectionData?.sleep?.hours) {
      const hours = reflectionData.sleep.hours;
      let sleepText = "";
      if (hours >= 7 && hours <= 9) {
        sleepText = `You rested for ${hours}h — right in your sweet spot.`;
      } else if (hours < 6) {
        sleepText = `Even ${hours}h of rest counts — take it easy today.`;
      } else {
        sleepText = `You rested for ${hours}h — your body knows what it needs.`;
      }
      generatedInsights.push({
        icon: Moon,
        text: sleepText,
        visible: false
      });
    }

    // Movement insight
    if (movementMinutes > 0) {
      const goalPercent = Math.round((movementMinutes / 30) * 100);
      let moveText = "";
      if (goalPercent >= 80) {
        moveText = `You hit ${goalPercent}% of your move goal — a gentle victory.`;
      } else if (goalPercent >= 50) {
        moveText = `You moved for ${movementMinutes} minutes — every step counts.`;
      } else {
        moveText = `You moved ${movementMinutes} minutes — momentum builds slowly.`;
      }
      generatedInsights.push({
        icon: Footprints,
        text: moveText,
        visible: false
      });
    }

    // Hydration insight
    if (waterCups > 0) {
      const hydrationPercent = Math.round((waterCups / 8) * 100);
      let waterText = "";
      if (hydrationPercent >= 80) {
        waterText = "Fluids were on track — keep your river flowing.";
      } else if (hydrationPercent >= 50) {
        waterText = `${waterCups} cups down — gentle progress.`;
      } else {
        waterText = "A gentle nudge — more water helps balance.";
      }
      generatedInsights.push({
        icon: Droplet,
        text: waterText,
        visible: false
      });
    }

    // Nutrition insight
    if (caloriesConsumed > 0) {
      const caloriePercent = Math.round((caloriesConsumed / calorieGoal) * 100);
      let nutritionText = "";
      if (caloriePercent >= 80 && caloriePercent <= 110) {
        nutritionText = "Your nourishment was balanced today — harmony found.";
      } else if (caloriePercent < 80) {
        nutritionText = "You nourished yourself gently — that's enough.";
      } else {
        nutritionText = "You fueled yourself fully — your body knows what it needs.";
      }
      generatedInsights.push({
        icon: Sparkles,
        text: nutritionText,
        visible: false
      });
    }

    // Streak insight
    if (streak > 0) {
      generatedInsights.push({
        icon: Target,
        text: `That's ${streak} days of showing up — Ottr's proud.`,
        visible: false
      });
    }

    setInsights(generatedInsights.slice(0, 4));

    // Stagger the fade-in of insights
    generatedInsights.slice(0, 4).forEach((_, index) => {
      setTimeout(() => {
        setInsights(prev => 
          prev.map((insight, i) => 
            i === index ? { ...insight, visible: true } : insight
          )
        );
      }, index * 300);
    });
  }, [reflectionData, caloriesConsumed, calorieGoal, waterCups, movementMinutes, streak]);

  const handleComplete = () => {
    if (reflection.trim()) {
      onComplete(reflection);
    }
  };

  const hydrationPercent = waterCups > 0 ? Math.round((waterCups / 8) * 100) : 0;
  const movementPercent = movementMinutes > 0 ? Math.round((movementMinutes / 30) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      {/* Ambient background with breathing animation */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))`,
            animation: "breathing 4s ease-in-out infinite"
          }}
        />
        
        {/* Content Container */}
        <div className="relative bg-background/40 backdrop-blur-xl border border-border/20 rounded-3xl p-8 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              One last reflection…
            </h2>
            <p className="text-lg text-muted-foreground italic">
              {prompt}
            </p>
          </div>

          {/* Visual Insights Row */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
            {/* Hydration Circle */}
            {waterCups > 0 && (
              <div className="flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
                <CircularProgress 
                  percentage={hydrationPercent}
                  size={80}
                  strokeWidth={6}
                  label="Hydration"
                  value={`${waterCups}`}
                  status={hydrationPercent >= 80 ? "success" : "normal"}
                  showGlow={hydrationPercent >= 80}
                />
                <div className="mt-2 flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">cups today</p>
                </div>
              </div>
            )}

            {/* Movement Indicator */}
            {movementMinutes > 0 && (
              <div className="flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
                <CircularProgress 
                  percentage={movementPercent}
                  size={80}
                  strokeWidth={6}
                  label="Movement"
                  value={`${movementMinutes}m`}
                  status={movementPercent >= 80 ? "success" : "normal"}
                  showGlow={movementPercent >= 80}
                />
                <div className="mt-2 flex items-center gap-1.5">
                  <Footprints className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">active minutes</p>
                </div>
              </div>
            )}

            {/* Spotlight Meal */}
            {caloriesConsumed > 0 && (
              <div className="flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl p-6 border border-border/30 col-span-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UtensilsCrossed className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">
                      {Math.round((caloriesConsumed / calorieGoal) * 100)}% of daily goal
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      {caloriesConsumed} / {calorieGoal} calories
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Textual Insights */}
          {insights.length > 0 && (
            <div className="space-y-3">
              {insights.slice(0, 2).map((insight, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/30 transition-all duration-500 ${
                    insight.visible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <insight.icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm text-foreground italic leading-relaxed pt-1">
                    {insight.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Summary Pattern Line */}
          {streak > 2 && (
            <div className="text-center animate-fade-in" style={{ animationDelay: "600ms" }}>
              <p className="text-sm text-muted-foreground italic">
                You've been showing up consistently — {streak} days strong. Keep flowing with your rhythm.
              </p>
            </div>
          )}

          {/* Reflection Input */}
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Take a moment to write what comes to mind..."
              className="min-h-[120px] bg-background/60 backdrop-blur-sm border-border/30 text-foreground placeholder:text-muted-foreground resize-none rounded-2xl focus-visible:ring-primary/50"
            />
          </div>

          {/* Complete Button */}
          <Button
            onClick={handleComplete}
            disabled={!reflection.trim()}
            className="w-full py-6 text-base font-medium rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Complete Reflection
          </Button>

          {/* Affirmation */}
          <div className="text-center animate-fade-in" style={{ animationDelay: "800ms" }}>
            <p className="text-xs text-muted-foreground italic">
              🦦 "You showed up for yourself today."
            </p>
          </div>

          {/* Decorative sparkles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <Sparkles
                key={i}
                className="absolute text-primary/10"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${8 + Math.random() * 8}px`,
                  height: `${8 + Math.random() * 8}px`,
                  animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
