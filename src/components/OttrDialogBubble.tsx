import { useEffect, useState } from "react";
import { OtterMood } from "./OtterMascot";

interface OttrDialogBubbleProps {
  message: string;
  mood?: OtterMood;
  duration?: number;
  onDismiss?: () => void;
}

export const OttrDialogBubble = ({ 
  message, 
  mood = "happy", 
  duration = 4000,
  onDismiss 
}: OttrDialogBubbleProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in
    setTimeout(() => setVisible(true), 100);

    // Auto-dismiss
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss?.(), 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      className={`
        fixed top-20 left-1/2 -translate-x-1/2 z-50
        bg-card/95 backdrop-blur-md border-2 border-primary/30 rounded-3xl
        px-5 py-3 shadow-[0_8px_30px_rgba(147,51,234,0.3)]
        transition-all duration-[1500ms] ease-out
        ${visible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl animate-wiggle">🦦</span>
        <p className="text-sm font-medium text-foreground max-w-[250px]">
          {message}
        </p>
      </div>

      {/* Speech bubble tail */}
      <div 
        className="absolute -bottom-2 left-8 w-4 h-4 bg-card border-r-2 border-b-2 border-primary/30 rotate-45"
      />
    </div>
  );
};
