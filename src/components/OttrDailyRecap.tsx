import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { OtterMascot, OtterMood } from "@/components/OtterMascot";
import { Sparkles, Users, Trophy, Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useAppContext } from "@/contexts/AppContext";

interface DailyStats {
  personalActions: number;
  socialActions: number;
  friendsActive: number;
  streakMaintained: boolean;
}

export const OttrDailyRecap = () => {
  const { user } = useAuth();
  const { streak } = useAppContext();
  const [stats, setStats] = useState<DailyStats>({
    personalActions: 0,
    socialActions: 0,
    friendsActive: 0,
    streakMaintained: streak > 0,
  });
  const [mood, setMood] = useState<OtterMood>("happy");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      loadDailyStats();
    }
  }, [user]);

  useEffect(() => {
    determineMoodAndMessage();
  }, [stats]);

  const loadDailyStats = async () => {
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count personal actions (food logs from AppContext)
    const personalActions = 3; // Mock - would get from AppContext

    // Count social actions (reactions, shares)
    const { data: reactions } = await supabase
      .from("reactions")
      .select("id")
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    const { data: activities } = await supabase
      .from("activity_feed")
      .select("id")
      .eq("actor_id", user.id)
      .gte("created_at", today.toISOString());

    // Count active friends
    const { data: friendActivities } = await supabase
      .from("activity_feed")
      .select("actor_id")
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    const uniqueFriends = new Set(friendActivities?.map((a) => a.actor_id) || []);

    setStats({
      personalActions,
      socialActions: (reactions?.length || 0) + (activities?.length || 0),
      friendsActive: uniqueFriends.size,
      streakMaintained: streak > 0,
    });
  };

  const determineMoodAndMessage = () => {
    const { personalActions, socialActions, friendsActive } = stats;
    const totalActions = personalActions + socialActions;

    if (totalActions === 0) {
      setMood("encouraging");
      setMessage("Ready to start your day? Let's log something!");
    } else if (socialActions > personalActions) {
      setMood("joyful");
      setMessage(`You're a social otter! ${socialActions} friend interactions today! 🌊`);
    } else if (personalActions >= 3 && socialActions >= 2) {
      setMood("proud");
      setMessage("Balanced day! Personal care + community support = perfect!");
    } else if (friendsActive >= 3) {
      setMood("happy");
      setMessage(`${friendsActive} friends active today! The otter cove is thriving!`);
    } else if (stats.streakMaintained) {
      setMood("proud");
      setMessage(`${streak} day streak! Consistency is your superpower! 🔥`);
    } else {
      setMood("happy");
      setMessage("Every action counts! Keep swimming forward!");
    }
  };

  return (
    <Card className="p-5 bg-gradient-to-br from-primary/5 via-card to-accent/5 border-2 border-primary/20">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        <h3 className="text-sm font-bold text-foreground">Ottr's Daily Recap</h3>
      </div>

      <OtterMascot mood={mood} message={message} animate={true} className="mb-4" />

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{stats.personalActions}</p>
          <p className="text-[10px] text-muted-foreground">Personal</p>
        </div>

        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{stats.socialActions}</p>
          <p className="text-[10px] text-muted-foreground">Social</p>
        </div>

        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <Users className="w-5 h-5 text-success mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{stats.friendsActive}</p>
          <p className="text-[10px] text-muted-foreground">Friends</p>
        </div>
      </div>
    </Card>
  );
};
