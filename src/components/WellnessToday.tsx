import { useState } from "react";
import { OtterMascot } from "./OtterMascot";
import { XPBar } from "./XPBar";
import { StreakCounter } from "./StreakCounter";
import { HydrationRiver } from "./HydrationRiver";
import { NutritionHills } from "./NutritionHills";
import { MovementGusts } from "./MovementGusts";
import { MoodReflectionCard } from "./MoodReflectionCard";
import { StickerReveal } from "./StickerReveal";
import { Confetti } from "./Confetti";
import { AmbientParticle } from "./AmbientParticle";
import { useAppContext } from "@/contexts/AppContext";
import { Moon, Sun, Cloud, Droplets, Wind, Sparkles } from "lucide-react";

const moods = ["😊", "😌", "😔", "😴", "🤩", "😐"];

export const WellnessToday = () => {
  const { xp, level, streak, waterConsumed, waterTarget, getXPForNextLevel, getCaloriesRemaining } = useAppContext();
  const [sleep, setSleep] = useState<number>(7);
  const [energy, setEnergy] = useState<number>(3);
  const [morningMood, setMorningMood] = useState<string>("");
  const [eveningMood, setEveningMood] = useState<string>("");
  const [showStickerReveal, setShowStickerReveal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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

  const [twilightMode, setTwilightMode] = useState(false);

  const handleCompleteDay = () => {
    setShowConfetti(true);
    setTwilightMode(true);
    setTimeout(() => {
      setShowStickerReveal(true);
      setShowConfetti(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen pb-24">
      {/* Animated gradient background */}
      <div className={`fixed inset-0 bg-gradient-to-br ${twilightMode ? "from-[#C4B5FD] via-[#1E293B] to-[#0F172A]" : getGradientByTime()} transition-all duration-[3000ms] -z-10`} />
      
      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* 1️⃣ HeaderScene */}
        <section className="relative text-center space-y-6 animate-fade-in">
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
          
          <div className="space-y-2 px-4">
            <h1 className="text-2xl font-bold text-foreground tracking-wide" style={{ letterSpacing: '0.02em' }}>
              Welcome back! You've shown up <span className="text-primary font-black">{streak}</span> days straight.
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-6">
            <StreakCounter days={streak} />
            <div className="w-full sm:w-64">
              <XPBar current={xp} max={getXPForNextLevel()} level={level} />
            </div>
          </div>
        </section>

        {/* Wave divider */}
        <div className="relative h-8 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 60" preserveAspectRatio="none">
            <path d="M0,30 Q300,10 600,30 T1200,30 L1200,60 L0,60 Z" fill="hsl(var(--primary) / 0.08)" className="animate-wave-flow" />
          </svg>
        </div>

        {/* 2️⃣ MorningState */}
        <section className="space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Sun className="w-6 h-6 text-[#FCA5A5]" />
            Setting the Tone
          </h2>
          
          <div className="grid gap-4">
            {/* Sleep */}
            <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">How rested do you feel?</label>
                <span className="text-sm text-muted-foreground">{sleep}h</span>
              </div>
              <input
                type="range"
                min="4"
                max="10"
                value={sleep}
                onChange={(e) => setSleep(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex items-center gap-2 text-2xl">
                <Moon className="w-5 h-5 text-primary" />
                {sleep >= 8 ? "😴💤" : sleep >= 6 ? "😌" : "😵‍💫"}
              </div>
            </div>

            {/* Energy */}
            <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">How's your energy right now?</label>
                <span className="text-sm text-muted-foreground">{energy}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full accent-accent"
              />
              <div className="flex items-center gap-2 text-2xl">
                <Cloud className="w-5 h-5 text-accent" />
                {energy >= 4 ? "⚡🔥" : energy >= 3 ? "💫" : "🪫"}
              </div>
            </div>

            {/* Mood */}
            <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg space-y-3">
              <label className="text-sm font-medium text-foreground block">How are you feeling this morning?</label>
              <div className="flex flex-wrap gap-2 justify-center px-2">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setMorningMood(mood)}
                    className={`text-5xl transition-all duration-300 px-2 py-1 rounded-2xl ${
                      morningMood === mood 
                        ? "scale-125 drop-shadow-lg animate-float" 
                        : "opacity-60 hover:opacity-90 hover:scale-110"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ DailyFlow - Unified Ecosystem */}
        <section className="space-y-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Your Day in Motion
          </h2>
          
          {/* Unified ecosystem container with shared gradient plane */}
          <div className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-3xl p-8 border border-border/20 shadow-xl overflow-hidden">
            {/* Ambient background layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/40 pointer-events-none" />
            
            <div className="relative space-y-8">
              {/* Hydration River - Bottom layer */}
              <div className="drop-shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Droplets className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Hydration River</span>
                </div>
                <HydrationRiver current={waterConsumed} goal={waterTarget} />
              </div>
              
              {/* Nutrition Hills - Mid layer */}
              <div className="drop-shadow-lg">
                <NutritionHills
                  protein={{ current: 45, target: 80 }}
                  carbs={{ current: 120, target: 200 }}
                  fats={{ current: 35, target: 60 }}
                />
              </div>
              
              {/* Movement Gusts - Top layer */}
              <div className="drop-shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Wind className="w-5 h-5 text-accent" />
                  <span className="text-sm font-semibold text-foreground">Movement Gusts</span>
                </div>
                <MovementGusts current={22} goal={30} />
              </div>
            </div>
          </div>
        </section>

        {/* 4️⃣ ReflectionZone */}
        <section className="space-y-4 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          {/* Evening mood check */}
          <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg space-y-3">
            <label className="text-sm font-medium text-foreground block">How are you feeling now?</label>
            <div className="flex flex-wrap gap-2 justify-center px-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setEveningMood(mood)}
                  className={`text-5xl transition-all duration-300 px-2 py-1 rounded-2xl ${
                    eveningMood === mood 
                      ? "scale-125 drop-shadow-lg animate-float" 
                      : "opacity-60 hover:opacity-90 hover:scale-110"
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 5️⃣ ClosureScene */}
        <section className="text-center space-y-6 py-8 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <div className="relative">
            <button
              onClick={handleCompleteDay}
              className="relative group w-full max-w-sm mx-auto bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-2xl hover:scale-[1.05] transition-all duration-300 overflow-hidden"
            >
              {/* Sparkle burst on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white rounded-full animate-sparkle-burst" style={{ animationDelay: "0s" }} />
                <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white rounded-full animate-sparkle-burst" style={{ animationDelay: "0.1s" }} />
              </div>
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                Complete My Day
                <span className="group-hover:animate-wiggle">✨</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
            </button>
          </div>
          
          {twilightMode && (
            <div className="animate-fade-in">
              <div className="flex justify-center mb-4">
                <OtterMascot mood="happy" className="w-24 animate-bounce-slow" animate={true} />
              </div>
              <p className="text-lg font-medium text-foreground">
                You did great today. Rest easy. 🌙
              </p>
            </div>
          )}
          
          {!twilightMode && (
            <p className="text-sm text-muted-foreground italic">
              You're close to unlocking <span className="text-primary font-medium">Gentle Current</span>
            </p>
          )}
        </section>
      </div>

      {/* Modals */}
      {showConfetti && <Confetti active={true} />}
      {showStickerReveal && (
        <StickerReveal
          stickerName="Gentle Current"
          stickerRarity="Flowing"
          onClose={() => setShowStickerReveal(false)}
        />
      )}
    </div>
  );
};
