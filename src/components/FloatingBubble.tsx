import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface FloatingBubbleProps {
  message: string;
  onDismiss: () => void;
  autoFadeMs?: number;
}

export const FloatingBubble = ({ message, onDismiss, autoFadeMs = 3000 }: FloatingBubbleProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 500);
    }, autoFadeMs);

    return () => clearTimeout(timer);
  }, [autoFadeMs, onDismiss]);

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
      }`}
    >
      <div className="relative bg-gradient-to-br from-primary/90 to-accent/90 backdrop-blur-md text-primary-foreground rounded-2xl px-4 py-3 shadow-[0_8px_30px_rgba(147,51,234,0.4)] max-w-xs animate-pop-in">
        <div className="flex items-start gap-2">
          <span className="text-2xl animate-wiggle">🦦</span>
          <p className="text-sm font-medium flex-1">{message}</p>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onDismiss, 500);
            }}
            className="shrink-0 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Bubble tail */}
        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-accent/90 rotate-45 rounded-sm" />
      </div>
    </div>
  );
};
