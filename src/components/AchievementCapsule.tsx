import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { OtterMascot } from "./OtterMascot";

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type AchievementCapsuleProps = {
  achievement: Achievement | null;
  onDismiss: () => void;
};

export const AchievementCapsule = ({ achievement, onDismiss }: AchievementCapsuleProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      // Slide up animation
      setTimeout(() => setIsVisible(true), 100);
      
      // Auto-dismiss after 4s
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 1000); // Wait for fade-out animation
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div
      className={`fixed bottom-20 left-4 right-4 z-50 flex justify-center transition-all duration-[1200ms] ease-out ${
        isVisible 
          ? "translate-y-0 opacity-100" 
          : "translate-y-[200%] opacity-0"
      }`}
    >
      <div className="max-w-md w-full bg-gradient-to-br from-primary via-accent to-primary rounded-3xl p-1 shadow-[0_20px_60px_rgb(0,0,0,0.3)]">
        <div className="bg-card rounded-[22px] p-6 relative">
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onDismiss, 1000);
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="flex items-start gap-4">
            <div className="text-5xl animate-bounce-slow">
              {achievement.icon}
            </div>
            
            <div className="flex-1 pt-1">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                Achievement Unlocked!
              </p>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {achievement.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {achievement.description}
              </p>
              
              {/* Mini Ottr celebration */}
              <div className="scale-75 origin-left -ml-2">
                <OtterMascot mood="joyful" message="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
