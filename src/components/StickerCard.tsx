import { Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickerCardProps {
  sticker: {
    id: string;
    name: string;
    description: string;
    rarity: "drifting" | "flowing" | "luminous" | "auroral" | "mythical";
    tier: "tide" | "ripple" | "wave" | "surge" | "crest";
    icon_emoji: string;
    category: string;
    unlock_criteria: string;
  };
  unlocked: boolean;
  count?: number;
  isSecret?: boolean;
  onTap?: () => void;
}

const rarityStyles = {
  drifting: {
    bg: "bg-gradient-to-br from-[#C6C9D2] to-[#E9E8F0]",
    glow: "",
    animation: "",
  },
  flowing: {
    bg: "bg-gradient-to-br from-[#9FD2E0] to-[#D1F3F9]",
    glow: "shadow-[0_0_15px_rgba(159,210,224,0.3)]",
    animation: "animate-shimmer",
  },
  luminous: {
    bg: "bg-gradient-to-br from-[#D0B3FF] to-[#F8D18E]",
    glow: "shadow-[0_0_25px_rgba(208,179,255,0.4)]",
    animation: "animate-pulse",
  },
  auroral: {
    bg: "bg-gradient-to-br from-[#7AE9FF] via-[#E3A8FF] to-[#FFC9C9]",
    glow: "shadow-[0_0_35px_rgba(227,168,255,0.5)]",
    animation: "animate-shimmer",
  },
  mythical: {
    bg: "bg-gradient-to-br from-[#D8E4FF] via-[#F0C9FF] to-[#FFF3CC]",
    glow: "shadow-[0_0_45px_rgba(240,201,255,0.6)]",
    animation: "animate-pulse",
  },
};

export const StickerCard = ({ sticker, unlocked, count = 1, isSecret, onTap }: StickerCardProps) => {
  const rarityConfig = rarityStyles[sticker.rarity];

  if (!unlocked) {
    return (
      <div
        className="relative aspect-square bg-muted/30 rounded-2xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center p-4 cursor-not-allowed"
      >
        <Lock className="w-8 h-8 text-muted-foreground/40 mb-2" />
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center text-3xl opacity-20">
          ?
        </div>
        <p className="text-xs text-muted-foreground/60 text-center mt-2 line-clamp-2">
          {sticker.unlock_criteria}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-square rounded-2xl border-2 border-border/30 p-4 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95",
        rarityConfig.bg,
        rarityConfig.glow,
        rarityConfig.animation
      )}
      onClick={onTap}
    >
      {/* Secret Variant Indicator */}
      {isSecret && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
          <Star className="w-4 h-4 text-white fill-white" />
        </div>
      )}

      {/* Duplicate Counter */}
      {count > 1 && (
        <div className="absolute top-2 left-2 w-6 h-6 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-border/50">
          <span className="text-xs font-bold text-foreground">×{count}</span>
        </div>
      )}

      {/* Sticker Content */}
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <div className="text-5xl mb-1 drop-shadow-lg">
          {sticker.icon_emoji}
        </div>
        <h4 className="text-xs font-bold text-foreground/90 text-center line-clamp-2">
          {sticker.name}
        </h4>
        <div className="text-[10px] font-medium text-foreground/60 uppercase tracking-wide">
          {sticker.rarity} • {sticker.tier}
        </div>
      </div>

      {/* Paper texture overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-5 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.1)_100%)]" />
    </div>
  );
};
