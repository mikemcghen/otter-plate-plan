import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "./ui/button";

interface DailyFocusProps {
  onComplete: () => void;
}

const dailyFocuses = [
  { id: "hydration", text: "Stay hydrated 💧", subtitle: "8 glasses today", icon: "💧" },
  { id: "balance", text: "Balanced bites 🍽", subtitle: "Hit your macros", icon: "🍽" },
  { id: "reflection", text: "Reflect 🌙", subtitle: "Log a mindful thought", icon: "🌙" },
  { id: "connect", text: "Connect 🌊", subtitle: "Send a wave to a friend", icon: "🌊" },
  { id: "movement", text: "Gentle movement 🦦", subtitle: "Take a walk", icon: "🦦" },
];

export const DailyFocus = ({ onComplete }: DailyFocusProps) => {
  // Auto-generate daily focus based on day of week
  const dayOfWeek = new Date().getDay();
  const todaysFocus = dailyFocuses[dayOfWeek % dailyFocuses.length];
  
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <div 
      className={`
        bg-card/60 backdrop-blur-md rounded-3xl p-6 
        shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
        border-2 border-border/50
        transition-all duration-[2000ms] ease-out
        ${isCompleted ? "scale-95 opacity-70" : ""}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-breathing">{todaysFocus.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-foreground">Today's Focus</h3>
              <p className="text-sm text-muted-foreground">{todaysFocus.subtitle}</p>
            </div>
          </div>
          <p className="text-base font-medium text-foreground/80 pl-11">
            {todaysFocus.text}
          </p>
        </div>
        
        <Button
          onClick={handleComplete}
          disabled={isCompleted}
          className={`
            min-w-[80px] rounded-full transition-all duration-[1500ms]
            ${isCompleted 
              ? "bg-success hover:bg-success text-white" 
              : "bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary"
            }
          `}
        >
          {isCompleted ? (
            <span className="flex items-center gap-1 animate-pop-in">
              <Check className="w-4 h-4" />
              Done
            </span>
          ) : (
            "Complete"
          )}
        </Button>
      </div>
      
      {isCompleted && (
        <p className="text-center text-sm text-success mt-4 animate-fade-in">
          🌊 The water ripples with your progress...
        </p>
      )}
    </div>
  );
};
