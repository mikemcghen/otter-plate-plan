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
  joyful: "Amazing! You're on a roll!",
  sleepy: "Time to rest, swimmer",
  hungry: "Your body needs fuel!",
  proud: "Consistency champion!",
  encouraging: "Welcome back! Every day is a fresh start",
  happy: "Great to see you!",
};

export const OtterMascot = ({ 
  mood, 
  message, 
  className = "", 
  animate = true 
}: OtterMascotProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isIdle, setIsIdle] = useState(true);

  useEffect(() => {
    if (animate) {
      setIsVisible(true);
    }
  }, [animate, mood]);

  // Idle animation loop (gentle float and blink)
  useEffect(() => {
    const idleInterval = setInterval(() => {
      setIsIdle(prev => !prev);
    }, 3000);
    return () => clearInterval(idleInterval);
  }, []);

  const displayMessage = message || otterMessages[mood];

  // Determine animation state
  const getAnimationClass = () => {
    if (!animate) return "";
    if (mood === "proud" || mood === "joyful") return "animate-wiggle";
    if (mood === "sleepy") return "animate-breathing";
    return isIdle ? "animate-breathing" : "";
  };

  return (
    <div 
      className={`flex flex-col items-center gap-3 ${
        animate ? "animate-pop-in" : ""
      } ${className}`}
    >
      <div className={`relative transition-all duration-[2500ms] ${getAnimationClass()}`}>
        <img
          src={otterImages[mood]}
          alt={`Otter is ${mood}`}
          className="w-32 h-32 object-contain drop-shadow-lg"
          style={{
            filter: mood === "sleepy" ? "brightness(0.9)" : "brightness(1)",
          }}
        />
        {/* Glow effect for proud/joyful moods */}
        {(mood === "proud" || mood === "joyful") && (
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl -z-10 animate-glow-pulse" />
        )}
        {/* Resting moonlight for sleepy mood */}
        {mood === "sleepy" && (
          <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-xl -z-10 animate-breathing" />
        )}
      </div>
      
      {message && (
        <div className="text-center space-y-1 animate-fade-in">
          <p className="text-sm font-medium text-foreground/80 max-w-[240px]">
            {displayMessage}
          </p>
        </div>
      )}
    </div>
  );
};
