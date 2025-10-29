import { useEffect, useState } from "react";
import otterJoyful from "@/assets/otter-dancing.png";
import otterSleepy from "@/assets/otter-sleepy.png";
import otterHungry from "@/assets/otter-concerned.png";
import otterProud from "@/assets/otter-perfect.png";
import otterEncouraging from "@/assets/otter-encourage.png";
import otterHappy from "@/assets/otter-happy.png";

export type OtterMood = "joyful" | "sleepy" | "hungry" | "proud" | "encouraging" | "happy";

interface OtterMascotProps {
  mood: OtterMood;
  message?: string;
  className?: string;
  animate?: boolean;
}

const otterImages: Record<OtterMood, string> = {
  joyful: otterJoyful,
  sleepy: otterSleepy,
  hungry: otterHungry,
  proud: otterProud,
  encouraging: otterEncouraging,
  happy: otterHappy,
};

const otterMessages: Record<OtterMood, string> = {
  joyful: "🎉 Amazing! You're on a roll!",
  sleepy: "😴 Time to rest, swimmer",
  hungry: "🍪 Your body needs fuel!",
  proud: "💪 Consistency champion!",
  encouraging: "💜 Welcome back! Every day is a fresh start",
  happy: "🦦 Great to see you!",
};

export const OtterMascot = ({ 
  mood, 
  message, 
  className = "", 
  animate = true 
}: OtterMascotProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (animate) {
      setIsVisible(true);
    }
  }, [animate, mood]);

  const displayMessage = message || otterMessages[mood];

  return (
    <div 
      className={`flex flex-col items-center gap-3 ${
        animate ? "animate-pop-in" : ""
      } ${className}`}
    >
      <div className={`relative ${animate && isVisible ? "animate-wiggle" : ""}`}>
        <img
          src={otterImages[mood]}
          alt={`Otter is ${mood}`}
          className="w-24 h-24 object-contain"
        />
        {/* Glow effect for proud/joyful moods */}
        {(mood === "proud" || mood === "joyful") && (
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl -z-10 animate-glow-pulse" />
        )}
      </div>
      
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-foreground">
          {displayMessage}
        </p>
      </div>
    </div>
  );
};
