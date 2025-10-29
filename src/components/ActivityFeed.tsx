import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LogIn, ChefHat, Cookie, Trophy, Flame, Heart, Sparkles 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import otterHappy from "@/assets/otter-happy.png";

interface Activity {
  id: string;
  activity_type: string;
  created_at: string;
  actor: {
    display_name: string;
    avatar_url?: string;
  };
  metadata?: any;
}

export const ActivityFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (user) {
      loadActivities();
      
      // Subscribe to real-time updates
      const channel = supabase
        .channel("activity_feed_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "activity_feed",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            loadActivities();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadActivities = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("activity_feed")
      .select(`
        *,
        actor:profiles!activity_feed_actor_id_fkey(display_name, avatar_url)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) {
      setActivities(data as any);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="w-4 h-4 text-primary" />;
      case "shared_snack":
        return <Cookie className="w-4 h-4 text-accent" />;
      case "shared_recipe":
        return <ChefHat className="w-4 h-4 text-accent" />;
      case "earned_badge":
        return <Trophy className="w-4 h-4 text-warning" />;
      case "duo_streak":
        return <Flame className="w-4 h-4 text-streak" />;
      case "reaction":
        return <Heart className="w-4 h-4 text-destructive" />;
      case "encouragement":
        return <Sparkles className="w-4 h-4 text-primary" />;
      default:
        return <Sparkles className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    const name = activity.actor?.display_name || "Someone";
    switch (activity.activity_type) {
      case "login":
        return `${name} logged in`;
      case "shared_snack":
        return `${name} shared a snack`;
      case "shared_recipe":
        return `${name} shared a recipe`;
      case "earned_badge":
        return `${name} earned a badge`;
      case "duo_streak":
        return `You and ${name} both logged today!`;
      case "reaction":
        return `${name} reacted to your content`;
      case "encouragement":
        return `${name} sent you encouragement`;
      default:
        return `${name} did something cool`;
    }
  };

  if (activities.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <img src={otterHappy} alt="Otter" className="w-16 h-16" />
          <p className="text-sm text-muted-foreground">
            No recent activity from friends
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        Friend Activity
      </h3>
      <div className="space-y-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
          >
            <Avatar className="w-8 h-8 border-2 border-primary/20">
              <AvatarImage src={activity.actor?.avatar_url || otterHappy} />
              <AvatarFallback>{activity.actor?.display_name?.[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {getActivityIcon(activity.activity_type)}
                <p className="text-xs text-foreground font-medium">
                  {getActivityText(activity)}
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
