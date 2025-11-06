import { useEffect, useState } from "react";
import { Droplets } from "lucide-react";

interface HydrationRiverProps {
  current: number;
  goal: number;
}

export const HydrationRiver = ({ current, goal }: HydrationRiverProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = Math.min((current / goal) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">Hydration River</span>
        </div>
        <span className="text-sm text-muted-foreground">{current}/{goal} glasses</span>
      </div>
      
      <div className="relative h-12 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
        {/* Animated water fill */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-1000 ease-out"
          style={{ width: `${animatedValue}%` }}
        >
          {/* Ripple animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
        </div>
        
        {/* Floating bubbles */}
        {animatedValue > 20 && (
          <>
            <div className="absolute bottom-2 left-[15%] w-2 h-2 bg-white/40 rounded-full animate-[float_4s_ease-in-out_infinite]" />
            <div className="absolute bottom-3 left-[35%] w-1.5 h-1.5 bg-white/30 rounded-full animate-[float_5s_ease-in-out_infinite_0.5s]" />
            <div className="absolute bottom-2 left-[55%] w-2.5 h-2.5 bg-white/35 rounded-full animate-[float_4.5s_ease-in-out_infinite_1s]" />
          </>
        )}
        
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-foreground/70 drop-shadow-sm">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-2 italic">
        {percentage >= 100 ? "River flowing strong! 🌊" : percentage >= 70 ? "Almost there, keep flowing" : "Your river needs you"}
      </p>
    </div>
  );
};
