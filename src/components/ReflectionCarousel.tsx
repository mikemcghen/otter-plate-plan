import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { SleepReflectionCard } from "./SleepReflectionCard";
import { EnergyReflectionCard } from "./EnergyReflectionCard";
import { MoodReflectionCard } from "./MoodReflectionCard";
import { HydrationReflectionCard } from "./HydrationReflectionCard";
import { OpenReflectionCard } from "./OpenReflectionCard";
import { CompletionPanel } from "./CompletionPanel";
import { OtterMascot } from "./OtterMascot";
import { StreakCounter } from "./StreakCounter";
import { useAppContext } from "@/contexts/AppContext";

export const ReflectionCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [reflectionData, setReflectionData] = useState<any>({});
  const { streak, waterConsumed, foodLogs } = useAppContext();

  const totalCards = 5;

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleCardComplete = (step: string, data: any) => {
    const updated = { ...reflectionData, [step]: data };
    setReflectionData(updated);
    
    // Auto-advance to next card
    if (step !== "reflection" && api) {
      setTimeout(() => api.scrollNext(), 400);
    }
  };

  const allCompleted = reflectionData.reflection !== undefined;

  const steps = ["sleep", "energy", "mood", "hydration", "reflection"];
  const completedCount = steps.filter(s => reflectionData[s] !== undefined).length;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 overflow-hidden">
      {/* Header with Ottr and Streak */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 pb-2 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm">
        <div className="scale-75 origin-left">
          <OtterMascot mood="happy" message="" animate={false} />
        </div>
        <StreakCounter days={streak} />
      </div>

      {/* Progress Dots */}
      <div className="absolute top-20 left-0 right-0 z-10 flex justify-center gap-2 px-4">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-primary"
                : i < completedCount
                ? "w-1.5 bg-primary/60"
                : "w-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Carousel */}
      {!allCompleted ? (
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: false,
            skipSnaps: false,
            duration: 18,
          }}
          className="h-full w-full pt-28 pb-8"
        >
          <CarouselContent className="h-full">
            <CarouselItem className="h-full">
              <SleepReflectionCard
                onComplete={(data) => handleCardComplete("sleep", data)}
                data={reflectionData.sleep}
              />
            </CarouselItem>
            <CarouselItem className="h-full">
              <EnergyReflectionCard
                onComplete={(data) => handleCardComplete("energy", data)}
                data={reflectionData.energy}
                recentFoodTags={foodLogs.slice(-3).map(f => f.name)}
              />
            </CarouselItem>
            <CarouselItem className="h-full">
              <MoodReflectionCard
                onComplete={(data) => handleCardComplete("mood", data)}
                data={reflectionData.mood}
                waterCups={Math.floor(waterConsumed / 8)}
              />
            </CarouselItem>
            <CarouselItem className="h-full">
              <HydrationReflectionCard
                onComplete={(data) => handleCardComplete("hydration", data)}
                data={reflectionData.hydration}
              />
            </CarouselItem>
            <CarouselItem className="h-full">
              <OpenReflectionCard
                onComplete={(data) => handleCardComplete("reflection", data)}
                data={reflectionData.reflection}
                reflectionData={reflectionData}
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      ) : (
        <CompletionPanel />
      )}
    </div>
  );
};
