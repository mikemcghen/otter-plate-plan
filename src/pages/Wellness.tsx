import { useAppContext } from "@/contexts/AppContext";
import { OtterMascot } from "@/components/OtterMascot";
import { StreakCounter } from "@/components/StreakCounter";
import { XPBar } from "@/components/XPBar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { AmbientParticle } from "@/components/AmbientParticle";
import { ReflectionFlow } from "@/components/ReflectionFlow";

export default function Wellness() {
  const { xp, level, streak, getXPForNextLevel } = useAppContext();

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

        {/* Daily Reflection Flow */}
        <ReflectionFlow />
      </div>
      
      <MobileBottomNav />
    </div>
  );
}
