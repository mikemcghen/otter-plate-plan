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
        bg-card/50 backdrop-blur-xl rounded-[32px] p-8
        shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.25)]
        border border-border/30
        transition-all duration-[2000ms] ease-out
        ${isCompleted ? "scale-95 opacity-70" : ""}
      `}
    >
      <div className="text-center space-y-6">
        <div className="flex flex-col items-center gap-3">
          <span className="text-5xl animate-breathing">{todaysFocus.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-foreground/90">Today's Focus</h3>
            <p className="text-sm text-muted-foreground mt-1">{todaysFocus.subtitle}</p>
          </div>
        </div>
        
        <p className="text-base font-medium text-foreground/70">
          {todaysFocus.text}
        </p>
        
        <Button
          onClick={handleComplete}
          disabled={isCompleted}
          size="lg"
          className={`
            w-full rounded-full transition-all duration-[1500ms] font-medium
            ${isCompleted 
              ? "bg-success hover:bg-success text-white shadow-lg shadow-success/30" 
              : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
            }
          `}
        >
          {isCompleted ? (
            <span className="flex items-center gap-2 animate-pop-in">
              <Check className="w-5 h-5" />
              Complete
            </span>
          ) : (
            "Complete Focus"
          )}
        </Button>
      </div>
      
      {isCompleted && (
        <p className="text-center text-sm text-success mt-6 animate-fade-in font-medium">
          🌊 The water ripples with your progress...
        </p>
      )}
    </div>
  );
};
