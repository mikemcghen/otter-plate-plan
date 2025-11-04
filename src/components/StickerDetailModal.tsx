import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Sparkles, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickerDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  variants?: Array<{
    rarity: string;
    tier: string;
    isSecret?: boolean;
  }>;
  isFavorite?: boolean;
  onSetFavorite?: () => void;
}

const rarityGradients = {
  drifting: "from-[#C6C9D2] to-[#E9E8F0]",
  flowing: "from-[#9FD2E0] to-[#D1F3F9]",
  luminous: "from-[#D0B3FF] to-[#F8D18E]",
  auroral: "from-[#7AE9FF] via-[#E3A8FF] to-[#FFC9C9]",
  mythical: "from-[#D8E4FF] via-[#F0C9FF] to-[#FFF3CC]",
};

export const StickerDetailModal = ({
  open,
  onOpenChange,
  sticker,
  variants = [],
  isFavorite,
  onSetFavorite,
}: StickerDetailModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl border-2 border-border p-0 overflow-hidden bg-gradient-to-b from-card to-muted/20">
        {/* Header with gradient matching sticker rarity */}
        <div className={cn(
          "relative p-8 bg-gradient-to-br",
          rarityGradients[sticker.rarity]
        )}>
          {/* Paper texture */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')]" />
          
          {/* Large emoji display */}
          <div className="relative text-center">
            <div className="text-8xl mb-4 drop-shadow-2xl animate-bounce-subtle">
              {sticker.icon_emoji}
            </div>
            <h2 className="text-2xl font-bold text-foreground/90 mb-1">
              {sticker.name}
            </h2>
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground/70">
              <span className="uppercase tracking-wide">{sticker.rarity}</span>
              <span>•</span>
              <span className="uppercase tracking-wide">{sticker.tier}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              How You Earned It
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {sticker.description}
            </p>
            <p className="text-xs text-muted-foreground/80 italic">
              {sticker.unlock_criteria}
            </p>
          </div>

          {/* Variants Section */}
          {variants.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                Your Collection ({variants.length})
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative aspect-square rounded-xl p-2 flex flex-col items-center justify-center bg-gradient-to-br",
                      rarityGradients[variant.rarity as keyof typeof rarityGradients] || rarityGradients.drifting
                    )}
                  >
                    {variant.isSecret && (
                      <Star className="absolute top-1 right-1 w-3 h-3 text-yellow-500 fill-yellow-500" />
                    )}
                    <div className="text-2xl mb-1">{sticker.icon_emoji}</div>
                    <div className="text-[8px] font-medium text-foreground/70 uppercase text-center">
                      {variant.rarity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            size="lg"
            variant={isFavorite ? "outline" : "default"}
            className="w-full h-12 rounded-2xl active:scale-95 transition-transform"
            onClick={onSetFavorite}
          >
            <Star className={cn(
              "w-5 h-5 mr-2",
              isFavorite && "fill-current"
            )} />
            {isFavorite ? "Favorited" : "Set as Favorite"}
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
