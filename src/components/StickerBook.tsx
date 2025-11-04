import { useState } from "react";
import { StickerCard } from "./StickerCard";
import { StickerDetailModal } from "./StickerDetailModal";
import { BookOpen } from "lucide-react";

interface Sticker {
  id: string;
  name: string;
  description: string;
  rarity: "drifting" | "flowing" | "luminous" | "auroral" | "mythical";
  tier: "tide" | "ripple" | "wave" | "surge" | "crest";
  icon_emoji: string;
  category: string;
  unlock_criteria: string;
  points_required: number;
}

interface UserSticker {
  badge_id: string;
  unlocked_at: string;
  is_secret?: boolean;
}

interface StickerBookProps {
  stickers: Sticker[];
  userStickers: UserSticker[];
  favoriteBadgeId?: string;
  onSetFavorite: (stickerId: string) => void;
}

export const StickerBook = ({ 
  stickers, 
  userStickers, 
  favoriteBadgeId,
  onSetFavorite 
}: StickerBookProps) => {
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const isStickerUnlocked = (stickerId: string) => {
    return userStickers.some(us => us.badge_id === stickerId);
  };

  const getStickerCount = (stickerId: string) => {
    return userStickers.filter(us => us.badge_id === stickerId).length;
  };

  const getStickerVariants = (stickerId: string) => {
    return userStickers
      .filter(us => us.badge_id === stickerId)
      .map(us => {
        const sticker = stickers.find(s => s.id === us.badge_id);
        return {
          rarity: sticker?.rarity || "drifting",
          tier: sticker?.tier || "tide",
          isSecret: us.is_secret,
        };
      });
  };

  const handleStickerTap = (sticker: Sticker) => {
    if (isStickerUnlocked(sticker.id)) {
      setSelectedSticker(sticker);
      setShowDetailModal(true);
    }
  };

  const unlockedCount = stickers.filter(s => isStickerUnlocked(s.id)).length;
  const totalCount = stickers.length;

  return (
    <div className="space-y-6">
      {/* Sticker Book Header */}
      <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">Sticker Collection</h2>
            <p className="text-sm text-muted-foreground">
              {unlockedCount} of {totalCount} collected
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-2 rounded-full bg-muted overflow-hidden mt-4">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-primary transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Paper-like background container */}
      <div className="relative bg-gradient-to-b from-[#F5F1E8] to-[#E8E4D8] rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-[#D4C9B0]">
        {/* Subtle paper texture overlay */}
        <div className="absolute inset-0 rounded-3xl opacity-30 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')]" />
        
        {/* Sticker Grid */}
        <div className="relative grid grid-cols-3 gap-4">
          {stickers.map((sticker) => (
            <StickerCard
              key={sticker.id}
              sticker={sticker}
              unlocked={isStickerUnlocked(sticker.id)}
              count={getStickerCount(sticker.id)}
              isSecret={userStickers.find(us => us.badge_id === sticker.id)?.is_secret}
              onTap={() => handleStickerTap(sticker)}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSticker && (
        <StickerDetailModal
          open={showDetailModal}
          onOpenChange={setShowDetailModal}
          sticker={selectedSticker}
          variants={getStickerVariants(selectedSticker.id)}
          isFavorite={favoriteBadgeId === selectedSticker.id}
          onSetFavorite={() => {
            onSetFavorite(selectedSticker.id);
            setShowDetailModal(false);
          }}
        />
      )}
    </div>
  );
};
