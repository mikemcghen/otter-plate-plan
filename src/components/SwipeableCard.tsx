import { useState, useRef, useEffect } from "react";
import { useHaptics } from "@/hooks/useHaptics";
import { Trash2, Edit, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeableCardProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
  onLog?: () => void;
  className?: string;
}

export const SwipeableCard = ({
  children,
  onDelete,
  onEdit,
  onLog,
  className,
}: SwipeableCardProps) => {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const { impact, selectionChanged } = useHaptics();

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    // Only allow swiping left (negative values)
    if (diff < 0) {
      setTranslateX(Math.max(diff, -120));
      if (Math.abs(diff) > 40 && Math.abs(diff) % 20 === 0) {
        selectionChanged();
      }
    }
  };

  const handleTouchEnd = async () => {
    setIsSwiping(false);
    
    // If swiped more than 60px, lock to action position
    if (translateX < -60) {
      setTranslateX(-120);
      await impact();
    } else {
      // Snap back
      setTranslateX(0);
    }
  };

  const handleAction = async (action?: () => void) => {
    if (action) {
      await impact();
      action();
      setTranslateX(0);
    }
  };

  // Reset swipe when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (translateX !== 0) {
        setTranslateX(0);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [translateX]);

  return (
    <div className="relative overflow-hidden">
      {/* Action buttons (revealed on swipe) */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center gap-2 pr-2">
        {onLog && (
          <button
            onClick={() => handleAction(onLog)}
            className="w-14 h-full flex items-center justify-center bg-success text-success-foreground rounded-l-lg active:scale-95 transition-transform"
          >
            <Check className="w-5 h-5" />
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => handleAction(onEdit)}
            className="w-14 h-full flex items-center justify-center bg-primary text-primary-foreground active:scale-95 transition-transform"
          >
            <Edit className="w-5 h-5" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => handleAction(onDelete)}
            className="w-14 h-full flex items-center justify-center bg-destructive text-destructive-foreground rounded-r-lg active:scale-95 transition-transform"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main card content */}
      <div
        className={cn(
          "transition-transform duration-200 ease-out touch-pan-y",
          className
        )}
        style={{
          transform: `translateX(${translateX}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};
