import { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { SleepReflectionCard } from "./SleepReflectionCard";
import { EnergyReflectionCard } from "./EnergyReflectionCard";
import { MoodReflectionCard } from "./MoodReflectionCard";
import { FinalReflectionCard } from "./FinalReflectionCard";
import { ReflectionSummary } from "./ReflectionSummary";
import { Moon, Zap, Heart, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import type { CarouselApi } from "@/components/ui/carousel";

interface ReflectionData {
  sleep?: { hours: number; quality: number };
  energy?: number;
  mood?: number;
  reflection?: string;
  completedAt?: string;
}

export const ReflectionFlow = () => {
  const { caloriesConsumed, caloriesTarget, waterConsumed, foodLogs, streak, xp, level } = useAppContext();
  const [flowState, setFlowState] = useState<"collapsed" | "active" | "complete">("collapsed");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [reflectionData, setReflectionData] = useState<ReflectionData>({});

  // Check if reflection is already complete today
  useEffect(() => {
    const stored = localStorage.getItem("dailyReflection");
    if (stored) {
      const data = JSON.parse(stored);
      const today = new Date().toDateString();
      if (data.completedAt === today) {
        setReflectionData(data);
        setFlowState("complete");
      }
    }
  }, []);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleStart = () => {
    setFlowState("active");
  };

  const handleStepComplete = (step: string, data: any) => {
    const updated = { ...reflectionData, [step]: data };
    setReflectionData(updated);

    if (step === "reflection") {
      // Final step - mark complete
      const final = { ...updated, completedAt: new Date().toDateString() };
      localStorage.setItem("dailyReflection", JSON.stringify(final));
      setReflectionData(final);
      setFlowState("complete");
    } else if (api) {
      // Auto-advance to next step
      setTimeout(() => api.scrollNext(), 400);
    }
  };

  const steps = [
    { icon: Moon, label: "Sleep" },
    { icon: Zap, label: "Energy" },
    { icon: Heart, label: "Feeling" },
    { icon: Sparkles, label: "Reflect" },
  ];

  if (flowState === "collapsed") {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <div 
          className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-background/40 border border-border/20 shadow-2xl p-6 space-y-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
          onClick={handleStart}
        >
          {/* Ambient decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 animate-breathing" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <Icon className="w-5 h-5 text-primary/60" strokeWidth={1.5} />
                    <span className="text-xs text-muted-foreground">{step.label}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Daily Reflection</h3>
              <p className="text-sm text-muted-foreground">
                A moment to check in with yourself
              </p>
            </div>

            <Button 
              className="w-full rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium"
              size="lg"
            >
              Start Reflection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (flowState === "complete") {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <ReflectionSummary 
          data={reflectionData}
          caloriesConsumed={caloriesConsumed}
          calorieGoal={caloriesTarget}
          waterCups={Math.floor(waterConsumed / 8)}
          foodLogs={foodLogs}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 animate-fade-in">
      <div 
        className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-background/40 border border-border/20 shadow-2xl"
        style={{ maxHeight: "70vh" }}
      >
        {/* Ambient decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 pointer-events-none" />
        
        {/* Progress dots */}
        <div className="relative z-10 flex justify-center gap-2 pt-4 pb-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-8 bg-primary"
                  : idx < current
                  ? "w-1.5 bg-primary/60"
                  : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Carousel */}
        <div className="relative z-10 overflow-hidden">
          <Carousel setApi={setApi} opts={{ watchDrag: true }}>
            <CarouselContent>
              <CarouselItem>
                <SleepReflectionCard 
                  onComplete={(data) => handleStepComplete("sleep", data)}
                  data={reflectionData.sleep}
                />
              </CarouselItem>
              <CarouselItem>
                <EnergyReflectionCard 
                  onComplete={(data) => handleStepComplete("energy", data)}
                  data={reflectionData.energy}
                  recentFoodTags={foodLogs.slice(-3).map(f => f.name)}
                />
              </CarouselItem>
              <CarouselItem>
                <MoodReflectionCard 
                  onComplete={(data) => handleStepComplete("mood", data)}
                  data={reflectionData.mood}
                  waterCups={Math.floor(waterConsumed / 8)}
                />
              </CarouselItem>
              <CarouselItem>
                <FinalReflectionCard 
                  onComplete={(data) => handleStepComplete("reflection", data)}
                  data={reflectionData.reflection}
                  reflectionData={reflectionData}
                  caloriesConsumed={caloriesConsumed}
                  calorieGoal={caloriesTarget}
                  waterCups={Math.floor(waterConsumed / 8)}
                  movementMinutes={0}
                  streak={streak}
                />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};
