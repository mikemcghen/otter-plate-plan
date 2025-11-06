import { OtterMascot } from "./OtterMascot";
import { XPBar } from "./XPBar";
import { StreakCounter } from "./StreakCounter";
import { AmbientParticle } from "./AmbientParticle";
import { useAppContext } from "@/contexts/AppContext";
import { TrendingUp, Droplets, Activity, Heart } from "lucide-react";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const WellnessWeek = () => {
  const { xp, level, streak, getXPForNextLevel } = useAppContext();

  // Mock data for the week
  const hydrationData = [6, 8, 7, 9, 8, 6, 7];
  const movementData = [25, 30, 20, 35, 30, 15, 28];
  const moodData = [4, 5, 3, 5, 4, 4, 5]; // 1-5 scale

  return (
    <div className="relative min-h-screen pb-24">
      {/* Gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#FDF6EC] via-[#C4B5FD]/20 to-[#C4B5FD]/40 -z-10" />
      
      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* 1️⃣ HeaderScene */}
        <section className="relative text-center space-y-6 animate-fade-in">
          {/* Breathing gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-3xl animate-breathing-gradient -z-10" />
          
          {/* Floating particles */}
          <AmbientParticle delay={0.5} size={6} left="20%" />
          <AmbientParticle delay={2} size={8} left="80%" />
          <AmbientParticle delay={1.2} size={5} left="50%" />
          
          <div className="flex justify-center pt-6">
            <OtterMascot 
              mood={streak > 7 ? "proud" : "encouraging"} 
              className="w-32"
              animate={true}
            />
          </div>
          
          <div className="space-y-2 px-4">
            <h1 className="text-2xl font-bold text-foreground tracking-wide">Your Week in Reflection</h1>
            <p className="text-sm text-muted-foreground">A story of rhythm and balance</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-6">
            <StreakCounter days={streak} />
            <div className="w-full sm:w-64">
              <XPBar current={xp} max={getXPForNextLevel()} level={level} />
            </div>
          </div>
        </section>

        {/* 2️⃣ RhythmTrends */}
        <section className="space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Your Rhythm
          </h2>
          
          <div className="space-y-4">
            {/* Hydration Riverline */}
            <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Hydration Riverline</h3>
              </div>
              
              <div className="relative h-32">
                <svg className="w-full h-full" viewBox="0 0 350 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="hydrationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M 0 ${120 - hydrationData[0] * 10} ${hydrationData.map((val, i) => `L ${(i + 1) * 50} ${120 - val * 10}`).join(" ")} L 350 120 L 0 120 Z`}
                    fill="url(#hydrationGradient)"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              
              <div className="flex justify-between mt-2">
                {weekDays.map((day, i) => (
                  <span key={day} className="text-xs text-muted-foreground">{day}</span>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground italic mt-3 text-center">
                Hydration was strongest midweek 🌊
              </p>
            </div>

            {/* Movement Dots */}
            <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-semibold text-foreground">Movement Gusts</h3>
              </div>
              
              <div className="flex justify-around items-end h-24">
                {movementData.map((val, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full bg-accent/20 border-2 border-accent transition-all duration-500"
                      style={{
                        transform: `scale(${val / 35})`,
                        opacity: val >= 30 ? 1 : 0.6,
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{weekDays[i]}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground italic mt-3 text-center">
                Movement dipped Friday — needed rest 💤
              </p>
            </div>
          </div>
        </section>

        {/* 3️⃣ WellbeingTrends */}
        <section className="space-y-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Heart className="w-6 h-6 text-secondary" />
            Your Wellbeing
          </h2>
          
          <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg">
            <h3 className="text-sm font-semibold text-foreground mb-4">Mood Journey</h3>
            
            <div className="relative h-32">
              <svg className="w-full h-full" viewBox="0 0 350 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="moodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 ${120 - moodData[0] * 20} ${moodData.map((val, i) => `L ${(i + 1) * 50} ${120 - val * 20}`).join(" ")} L 350 120 L 0 120 Z`}
                  fill="url(#moodGradient)"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="2"
                />
              </svg>
              
              {/* Emoji markers */}
              {moodData.map((val, i) => (
                <div
                  key={i}
                  className="absolute text-xl"
                  style={{
                    left: `${(i + 1) * 50}px`,
                    top: `${120 - val * 20 - 20}px`,
                    transform: "translateX(-50%)",
                  }}
                >
                  {val >= 5 ? "🤩" : val >= 4 ? "😊" : "😌"}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-2">
              {weekDays.map((day) => (
                <span key={day} className="text-xs text-muted-foreground">{day}</span>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground italic mt-3 text-center">
              You felt calmest on days with 7h+ sleep 💜
            </p>
          </div>
        </section>

        {/* 4️⃣ LearningScene */}
        <section className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-6 border border-primary/20 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <OtterMascot mood="happy" className="w-20" animate={false} />
              </div>
              <div className="space-y-4 flex-1">
                <p className="text-sm text-foreground italic">
                  "Seems like hydration really boosted your energy this week! 🌊"
                </p>
                <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium py-3 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                  Set new goal for next week
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ Epilogue */}
        <section className="text-center space-y-6 py-8 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl animate-glow-pulse" />
            <div className="relative bg-gradient-to-br from-[#9FD2E0] to-[#D1F3F9] w-32 h-32 rounded-3xl shadow-xl flex items-center justify-center mx-auto">
              <span className="text-5xl">✨</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">You earned 'Gentle Current'!</h2>
            <p className="text-sm text-muted-foreground">For staying consistent this week</p>
          </div>
          
          <p className="text-sm text-foreground italic">
            See you tomorrow, swimmer 🦦
          </p>
        </section>
      </div>
    </div>
  );
};
