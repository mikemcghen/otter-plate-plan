import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Waves, Sparkles } from "lucide-react";
import { useHaptics } from "@/hooks/useHaptics";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import otterHappy from "@/assets/otter-happy.png";

interface ReactionButtonsProps {
  contentId: string;
  onReactionAdded?: (xpGained: number) => void;
}

type ReactionType = "heart" | "thumbs_up" | "wave" | "otter";

interface ReactionCount {
  heart: number;
  thumbs_up: number;
  wave: number;
  otter: number;
}

export const ReactionButtons = ({ contentId, onReactionAdded }: ReactionButtonsProps) => {
  const { user } = useAuth();
  const { impact, notification } = useHaptics();
  const [reactions, setReactions] = useState<ReactionCount>({
    heart: 0,
    thumbs_up: 0,
    wave: 0,
    otter: 0,
  });
  const [userReactions, setUserReactions] = useState<Set<ReactionType>>(new Set());
  const [showOtterAnimation, setShowOtterAnimation] = useState(false);
  const [pulsingReaction, setPulsingReaction] = useState<ReactionType | null>(null);

  useEffect(() => {
    loadReactions();
  }, [contentId, user]);

  const loadReactions = async () => {
    const { data } = await supabase
      .from("reactions")
      .select("*")
      .eq("content_id", contentId);

    if (data) {
      const counts: ReactionCount = {
        heart: 0,
        thumbs_up: 0,
        wave: 0,
        otter: 0,
      };
      const userReacted = new Set<ReactionType>();

      data.forEach((reaction) => {
        counts[reaction.reaction_type as ReactionType]++;
        if (reaction.user_id === user?.id) {
          userReacted.add(reaction.reaction_type as ReactionType);
        }
      });

      setReactions(counts);
      setUserReactions(userReacted);
    }
  };

  const handleReaction = async (type: ReactionType) => {
    if (!user) return;

    await impact();

    if (userReactions.has(type)) {
      // Remove reaction
      const { error } = await supabase
        .from("reactions")
        .delete()
        .eq("content_id", contentId)
        .eq("user_id", user.id)
        .eq("reaction_type", type);

      if (!error) {
        setReactions((prev) => ({
          ...prev,
          [type]: Math.max(0, prev[type] - 1),
        }));
        setUserReactions((prev) => {
          const newSet = new Set(prev);
          newSet.delete(type);
          return newSet;
        });
      }
    } else {
      // Add reaction
      const { error } = await supabase
        .from("reactions")
        .insert({
          user_id: user.id,
          content_id: contentId,
          reaction_type: type,
        });

      if (!error) {
        await notification("success");
        setReactions((prev) => ({
          ...prev,
          [type]: prev[type] + 1,
        }));
        setUserReactions((prev) => new Set(prev).add(type));
        
        // Pulse animation
        setPulsingReaction(type);
        setTimeout(() => setPulsingReaction(null), 500);

        // Show Ottr animation for otter reaction
        if (type === "otter") {
          setShowOtterAnimation(true);
          setTimeout(() => setShowOtterAnimation(false), 2000);
        }

        // Award XP
        onReactionAdded?.(5);
      }
    }
  };

  const reactionButtons: Array<{ type: ReactionType; icon: any; label: string }> = [
    { type: "heart", icon: Heart, label: "💜" },
    { type: "thumbs_up", icon: ThumbsUp, label: "👍" },
    { type: "wave", icon: Waves, label: "🌊" },
    { type: "otter", icon: Sparkles, label: "🦦" },
  ];

  return (
    <div className="relative">
      <div className="flex gap-2">
        {reactionButtons.map(({ type, icon: Icon, label }) => (
          <Button
            key={type}
            variant={userReactions.has(type) ? "default" : "outline"}
            size="sm"
            onClick={() => handleReaction(type)}
            className={cn(
              "h-9 px-3 gap-1.5 transition-all duration-200 active:scale-95",
              pulsingReaction === type && "animate-pulse scale-110",
              userReactions.has(type) && "bg-primary/20 border-primary"
            )}
          >
            <span className="text-base">{label}</span>
            {reactions[type] > 0 && (
              <span className="text-xs font-bold">{reactions[type]}</span>
            )}
          </Button>
        ))}
      </div>

      {/* Ottr Animation */}
      {showOtterAnimation && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-pop-in pointer-events-none z-10">
          <img
            src={otterHappy}
            alt="Happy Otter"
            className="w-12 h-12 animate-wiggle"
          />
        </div>
      )}
    </div>
  );
};
