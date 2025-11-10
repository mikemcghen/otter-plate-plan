import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Sparkles, Moon, Sun, Droplets, Check } from "lucide-react";
import { OtterMascot } from "@/components/OtterMascot";
import { StreakCounter } from "@/components/StreakCounter";
import { XPBar } from "@/components/XPBar";
import { useAppContext } from "@/contexts/AppContext";
import { AmbientParticle } from "@/components/AmbientParticle";
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { SleepReflectionCard } from "@/components/SleepReflectionCard";
import { EnergyReflectionCard } from "@/components/EnergyReflectionCard";
import { MoodReflectionCard } from "@/components/MoodReflectionCard";
import { HydrationReflectionCard } from "@/components/HydrationReflectionCard";
import { OpenReflectionCard } from "@/components/OpenReflectionCard";

type ReflectionState = "collapsed" | "active" | "complete";

export default function Wellness() {
  const { xp, level, streak, getXPForNextLevel } = useAppContext();
  const [reflectionState, setReflectionState] = useState<ReflectionState>("collapsed");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false, false]);

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
    } else if (index === totalCards - 1) {
      // Last card completed
      setTimeout(() => setReflectionState("complete"), 500);
    }
  };

  const allCompleted = completed.every(c => c);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const getGradientByTime = () => {
    const time = getTimeOfDay();
    if (time === "morning") return "from-[#FCA5A5] via-[#2DD4BF] to-[#FDF6EC]";
    if (time === "afternoon") return "from-[#2DD4BF] via-[#C4B5FD] to-[#FDF6EC]";
    return "from-[#C4B5FD] via-[#0F172A] to-[#0F172A]";
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated gradient background */}
      <div className={`fixed inset-0 bg-gradient-to-br ${getGradientByTime()} transition-all duration-[3000ms] -z-10`} />
      
      <div className="container max-w-2xl mx-auto px-4 pt-8 pb-24">
        {/* Header Scene */}
        <section className="relative text-center space-y-6 animate-fade-in mb-12">
          {/* Breathing gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-3xl animate-breathing-gradient -z-10" />
          
          {/* Floating particles */}
          <AmbientParticle delay={0} size={6} left="15%" />
          <AmbientParticle delay={1.5} size={8} left="85%" />
          <AmbientParticle delay={0.8} size={5} left="45%" />
          <AmbientParticle delay={2.2} size={7} left="70%" />
          
          <div className="flex justify-center pt-6">
            <OtterMascot 
              mood={streak > 7 ? "proud" : "happy"} 
              className="w-32"
              animate={true}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-6">
            <StreakCounter days={streak} />
            <div className="w-full sm:w-64">
              <XPBar current={xp} max={getXPForNextLevel()} level={level} />
            </div>
          </div>
        </section>

        {/* Daily Reflection Tile */}
        <div 
          className={`relative bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 backdrop-blur-md rounded-3xl border-2 border-primary/30 shadow-xl overflow-hidden transition-all duration-200 ease-in-out ${
            reflectionState === "collapsed" 
              ? "p-8 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:border-primary/50 animate-card-breathing" 
              : "p-0"
          } ${
            reflectionState === "active" ? "min-h-[calc(100vh-200px)]" : ""
          }`}
          onClick={() => reflectionState === "collapsed" && setReflectionState("active")}
        >
          {/* Collapsed State */}
          {reflectionState === "collapsed" && (
            <>
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]" style={{ transition: 'all 1s ease-in-out' }} />
              
              {/* Background ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-breathing-gradient" />
              
              <div className="relative z-10 space-y-6">
                {/* Icon row */}
                <div className="flex items-center justify-center gap-4 text-primary/60">
                  <Moon className="w-6 h-6 animate-float" style={{ animationDelay: '0s' }} />
                  <Sun className="w-6 h-6 animate-float" style={{ animationDelay: '0.5s' }} />
                  <Droplets className="w-6 h-6 animate-float" style={{ animationDelay: '1s' }} />
                  <Sparkles className="w-6 h-6 animate-float" style={{ animationDelay: '1.5s' }} />
                </div>

                {/* Main content */}
                <div className="text-center space-y-3">
                  <h2 className="text-3xl font-bold text-foreground tracking-wide">
                    Daily Reflection
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Take a moment to reflect on your day — sleep, energy, mood, hydration, and thoughts
                  </p>
                </div>

                {/* CTA indicator */}
                <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                  <span>Start your reflection</span>
                  <Sparkles className="w-5 h-5 group-hover:animate-wiggle" />
                </div>

                {/* Progress hint */}
                <div className="flex items-center justify-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary/50 transition-colors"
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Active State - Carousel */}
          {reflectionState === "active" && (
            <div className="animate-scale-in">
              {/* Progress Dots */}
              <div className="absolute top-4 left-0 right-0 z-10 flex justify-center gap-2 px-4">
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
              <Carousel
                setApi={setApi}
                opts={{
                  align: "center",
                  loop: false,
                  skipSnaps: false,
                  duration: 18,
                }}
                className="h-full w-full pt-16 pb-8"
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
            </div>
          )}

          {/* Complete State */}
          {reflectionState === "complete" && (
            <div className="p-8 text-center space-y-6 animate-fade-in">
              {/* Background ambient glow with dusk tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-primary/10 animate-breathing-gradient" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-scale-in">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    Reflection complete for today
                  </h2>
                  <p className="text-muted-foreground">
                    Beautiful work. Rest easy knowing you've checked in with yourself.
                  </p>
                </div>

                <div className="flex justify-center pt-2">
                  <OtterMascot mood="proud" message="" animate={true} className="w-24" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <MobileBottomNav />
    </div>
  );
}
