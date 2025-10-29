import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface XPGainAnimationProps {
  amount: number;
  onComplete?: () => void;
}

export const XPGainAnimation = ({ amount, onComplete }: XPGainAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-[slideUp_2s_ease-out_forwards] pointer-events-none">
      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-bold">+{amount} XP</span>
      </div>
    </div>
  );
};
