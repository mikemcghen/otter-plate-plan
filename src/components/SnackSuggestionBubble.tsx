import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SnackSuggestionBubbleProps {
  caloriesConsumed: number;
  caloriesTarget: number;
  lastSnackTime?: Date;
}

export const SnackSuggestionBubble = ({ 
  caloriesConsumed, 
  caloriesTarget,
  lastSnackTime 
}: SnackSuggestionBubbleProps) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Only show once per session
    const hasShown = sessionStorage.getItem("snack-bubble-shown");
    if (hasShown) return;

    const underTarget = caloriesConsumed < caloriesTarget * 0.7;
    const timeSinceSnack = lastSnackTime 
      ? (Date.now() - lastSnackTime.getTime()) / (1000 * 60 * 60) 
      : 999;
    const longSinceSnack = timeSinceSnack > 4;

    if (underTarget || longSinceSnack) {
      const messages = [
        "🦦 Hungry? I found a snack that matches your macros!",
        "Your energy's dipping — want a quick pick-me-up idea?",
        "💜 Time for a mindful snack? Let's explore together!"
      ];
      
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
      
      setTimeout(() => {
        setShow(true);
        sessionStorage.setItem("snack-bubble-shown", "true");
        
        // Auto-hide after 12 seconds
        setTimeout(() => setShow(false), 12000);
      }, 3000);
    }
  }, [caloriesConsumed, caloriesTarget, lastSnackTime]);

  const handleClick = () => {
    // Navigate to Social Cove with snack filter
    navigate("/social?filter=snack");
  };

  if (!show) return null;

  return (
    <button
      onClick={handleClick}
      className={cn(
        "absolute left-1/2 -translate-x-1/2 -bottom-16 z-20",
        "max-w-[280px] px-4 py-3 rounded-2xl",
        "bg-gradient-to-br from-primary/95 to-primary/85 backdrop-blur-sm",
        "border border-white/20 shadow-lg",
        "text-sm text-white/95 text-center font-medium",
        "animate-fade-in cursor-pointer",
        "transition-all duration-300 hover:scale-105 active:scale-95"
      )}
      style={{
        animation: "fade-in 0.4s ease-out, float-drift 3s ease-in-out infinite",
      }}
    >
      {message}
      
      {/* Speech bubble tail */}
      <div 
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary/95 rotate-45 border-l border-t border-white/20"
      />
    </button>
  );
};
