import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { OtterMascot } from "./OtterMascot";

interface StickerRevealProps {
  stickerName: string;
  stickerRarity: string;
  onClose: () => void;
}

export const StickerReveal = ({ stickerName, stickerRarity, onClose }: StickerRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getRarityGradient = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "drifting": return "from-[#C6C9D2] to-[#E9E8F0]";
      case "flowing": return "from-[#9FD2E0] to-[#D1F3F9]";
      case "luminous": return "from-[#D0B3FF] to-[#F8D18E]";
      case "auroral": return "from-[#7AE9FF] via-[#E3A8FF] to-[#FFC9C9]";
      case "mythical": return "from-[#D8E4FF] via-[#F0C9FF] to-[#FFF3CC]";
      default: return "from-primary to-accent";
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div 
        className={`relative max-w-md w-full mx-4 transition-all duration-700 ${
          isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className={`absolute -inset-4 bg-gradient-to-br ${getRarityGradient(stickerRarity)} rounded-full blur-3xl opacity-40 animate-glow-pulse`} />
        
        {/* Content card */}
        <div className="relative bg-gradient-to-br from-background to-muted/40 rounded-3xl p-8 shadow-2xl border border-border/30">
          <div className="text-center space-y-6">
            {/* Sticker display */}
            <div className={`relative w-40 h-40 mx-auto bg-gradient-to-br ${getRarityGradient(stickerRarity)} rounded-3xl shadow-lg animate-wiggle`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-white drop-shadow-lg" />
              </div>
              {stickerRarity.toLowerCase() === "mythical" && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl animate-[shimmer_3s_ease-in-out_infinite]" />
              )}
            </div>
            
            {/* Text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Sticker Unlocked!</h2>
              <p className="text-lg font-semibold text-primary">{stickerName}</p>
              <p className="text-sm text-muted-foreground">Rarity: {stickerRarity}</p>
            </div>
            
            {/* Ottr celebration */}
            <div className="flex justify-center">
              <OtterMascot mood="joyful" className="w-24" animate={true} />
            </div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium py-3 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              Amazing!
            </button>
          </div>
        </div>
        
        {/* Confetti particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-[fall_3s_ease-out_forwards]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}px`,
              animationDelay: `${Math.random() * 0.5}s`,
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
