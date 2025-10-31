import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FriendWaveChipProps {
  waveCount?: number;
  friendName?: string;
}

export const FriendWaveChip = ({ waveCount = 0, friendName }: FriendWaveChipProps) => {
  const navigate = useNavigate();
  const [hasPulsed, setHasPulsed] = useState(false);

  useEffect(() => {
    if (waveCount > 0 && !hasPulsed) {
      setTimeout(() => setHasPulsed(true), 1000);
    }
  }, [waveCount, hasPulsed]);

  if (waveCount === 0) return null;

  const message = friendName 
    ? `💜 ${friendName} cheered you on!`
    : `✨ ${waveCount} new wave${waveCount > 1 ? 's' : ''} from friends!`;

  const handleClick = () => {
    navigate("/social?tab=friends");
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full",
        "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
        "border border-purple-400/30",
        "text-xs font-medium text-foreground/90",
        "transition-all duration-300 hover:scale-105 active:scale-95",
        "shadow-sm backdrop-blur-sm",
        !hasPulsed && "animate-pulse"
      )}
      style={{
        animation: !hasPulsed 
          ? "pulse 1s ease-in-out, glow-pulse 2s ease-in-out" 
          : undefined
      }}
    >
      <Sparkles className="w-3 h-3 text-purple-400" />
      <span>{message}</span>
    </button>
  );
};
