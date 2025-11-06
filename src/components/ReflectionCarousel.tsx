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
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false, false]);
  const { streak } = useAppContext();

  const totalCards = 5;

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleCardComplete = (index: number) => {
    const newCompleted = [...completed];
    newCompleted[index] = true;
    setCompleted(newCompleted);
    
    // Auto-advance to next card
    if (api && index < totalCards - 1) {
      setTimeout(() => api.scrollNext(), 300);
    }
  };

  const allCompleted = completed.every(c => c);

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
        {Array.from({ length: totalCards }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-primary"
                : completed[i]
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
            duration: 18, // 180ms = 18 in embla (uses 10ms units)
          }}
          className="h-full w-full pt-28 pb-8"
        >
          <CarouselContent className="h-full">
            <CarouselItem className="h-full">
              <SleepReflectionCard
                onComplete={() => handleCardComplete(0)}
                isCompleted={completed[0]}
              />
            </CarouselItem>
            <CarouselItem className="h-full">
              <EnergyReflectionCard
                onComplete={() => handleCardComplete(1)}
                isCompleted={completed[1]}
              />
            </CarouselItem>
            <CarouselItem className="h-full">
              <MoodReflectionCard
                onComplete={() => handleCardComplete(2)}
                isCompleted={completed[2]}
              />
            </CarouselItem>
            <CarouselItem className="h-full">
              <HydrationReflectionCard
                onComplete={() => handleCardComplete(3)}
                isCompleted={completed[3]}
              />
            </CarouselItem>
            <CarouselItem className="h-full">
              <OpenReflectionCard
                onComplete={() => handleCardComplete(4)}
                isCompleted={completed[4]}
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
