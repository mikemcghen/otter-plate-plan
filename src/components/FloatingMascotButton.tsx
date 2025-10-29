import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import otterHappy from "@/assets/otter-happy.png";
import { useHaptics } from "@/hooks/useHaptics";
import { X } from "lucide-react";

interface FloatingMascotButtonProps {
  caloriesRemaining: number;
  className?: string;
}

const tips = [
  "🍪 Snack idea: Greek yogurt and berries!",
  "💧 Don't forget to hydrate, swimmer!",
  "🦦 You're doing amazing! Keep going!",
  "🎯 Small wins lead to big victories!",
  "✨ Every meal is a fresh start!",
];

const encouragements = [
  "You're {calories} cals from your goal — let's finish strong! 💪",
  "Only {calories} more to go! You've got this! 🎯",
  "Almost there! Just {calories} cals to hit your target! ⚡",
];

export const FloatingMascotButton = ({
  caloriesRemaining,
  className = "",
}: FloatingMascotButtonProps) => {
  const [showTip, setShowTip] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const { impact } = useHaptics();

  useEffect(() => {
    if (showTip) {
      const timer = setTimeout(() => {
        setShowTip(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showTip]);

  const handleClick = async () => {
    await impact();

    // Choose message based on calories remaining
    let message: string;
    if (caloriesRemaining > 0 && caloriesRemaining < 500) {
      // Show encouragement about remaining calories
      const randomEncouragement =
        encouragements[Math.floor(Math.random() * encouragements.length)];
      message = randomEncouragement.replace("{calories}", caloriesRemaining.toString());
    } else {
      // Show general tip
      message = tips[Math.floor(Math.random() * tips.length)];
    }

    setCurrentMessage(message);
    setShowTip(true);
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        size="icon"
        className={`fixed bottom-24 right-6 w-16 h-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 active:scale-90 transition-all duration-200 z-40 animate-bounce-subtle ${className}`}
        onClick={handleClick}
      >
        <img
          src={otterHappy}
          alt="Ottr mascot"
          className="w-10 h-10 object-contain"
        />
      </Button>

      {/* Tip Popup */}
      {showTip && (
        <div className="fixed bottom-44 right-6 max-w-[250px] z-50 animate-fade-in">
          <div className="bg-card border-2 border-border rounded-2xl shadow-xl p-4 relative">
            <Button
              size="icon"
              variant="ghost"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-card border-2 border-border"
              onClick={() => setShowTip(false)}
            >
              <X className="w-3 h-3" />
            </Button>
            <p className="text-sm font-medium text-foreground pr-4">
              {currentMessage}
            </p>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-card border-r-2 border-b-2 border-border transform rotate-45" />
          </div>
        </div>
      )}
    </>
  );
};
