import { useState, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { useHaptics } from "@/hooks/useHaptics";
import otterHappy from "@/assets/otter-happy.png";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh = ({ onRefresh, children }: PullToRefreshProps) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const scrollElement = useRef<HTMLDivElement>(null);
  const { impact, notification } = useHaptics();

  const maxPullDistance = 120;
  const triggerDistance = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only allow pull-to-refresh if scrolled to top
    if (scrollElement.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isRefreshing || !scrollElement.current) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    // Only allow pulling down at the top of the scroll
    if (diff > 0 && scrollElement.current.scrollTop === 0) {
      e.preventDefault();
      const distance = Math.min(diff * 0.5, maxPullDistance);
      setPullDistance(distance);
      
      if (distance > triggerDistance) {
        impact();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > triggerDistance && !isRefreshing) {
      setIsRefreshing(true);
      await notification("success");
      
      try {
        await onRefresh();
      } finally {
        setPullDistance(0);
        setIsRefreshing(false);
      }
    } else {
      setPullDistance(0);
    }
  };

  const pullProgress = Math.min(pullDistance / triggerDistance, 1);

  return (
    <div
      ref={scrollElement}
      className="relative h-full overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center z-50 transition-all duration-200"
        style={{
          height: pullDistance,
          opacity: pullProgress,
          transform: `translateY(-${maxPullDistance - pullDistance}px)`,
        }}
      >
        {isRefreshing ? (
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <span className="text-xs font-medium text-muted-foreground">Refreshing...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <img
              src={otterHappy}
              alt="Pull to refresh"
              className="w-12 h-12 object-contain transition-transform"
              style={{
                transform: `rotate(${pullProgress * 360}deg) scale(${0.5 + pullProgress * 0.5})`,
              }}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {pullProgress >= 1 ? "Release to refresh" : "Pull to refresh"}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
