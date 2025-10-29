import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Badge {
  id: string;
  name: string;
  description: string;
  points_required: number;
  unlock_criteria: string;
}

export const useBadgeUnlock = (
  xp: number,
  level: number,
  streak: number,
  foodLogsCount: number,
  onBadgeUnlock?: (badge: Badge) => void
) => {
  const { user } = useAuth();
  const [checkedBadges, setCheckedBadges] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;

    const checkBadgeUnlocks = async () => {
      // Fetch all badges
      const { data: badges } = await supabase
        .from("badges")
        .select("*")
        .order("points_required");

      if (!badges) return;

      // Fetch user's unlocked badges
      const { data: userBadges } = await supabase
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", user.id);

      const unlockedBadgeIds = new Set(
        userBadges?.map((ub) => ub.badge_id) || []
      );

      // Check each badge for unlock criteria
      for (const badge of badges) {
        if (unlockedBadgeIds.has(badge.id) || checkedBadges.has(badge.id)) {
          continue;
        }

        let shouldUnlock = false;

        // Check based on category
        switch (badge.category) {
          case "streaks":
            shouldUnlock = streak >= badge.points_required;
            break;
          case "nutrition":
            shouldUnlock = level >= badge.points_required;
            break;
          case "recipes":
            shouldUnlock = foodLogsCount >= badge.points_required;
            break;
          case "community":
            shouldUnlock = xp >= badge.points_required;
            break;
        }

        if (shouldUnlock) {
          // Unlock the badge
          const { error } = await supabase
            .from("user_badges")
            .insert({
              user_id: user.id,
              badge_id: badge.id,
            });

          if (!error) {
            setCheckedBadges((prev) => new Set(prev).add(badge.id));
            onBadgeUnlock?.(badge);
            toast({
              title: "🎉 Badge Unlocked!",
              description: `${badge.name}: ${badge.description}`,
            });
          }
        }
      }
    };

    checkBadgeUnlocks();
  }, [xp, level, streak, foodLogsCount, user, checkedBadges, onBadgeUnlock]);
};
