import { Heart, MessageCircle, Waves } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StreakCounter } from "@/components/StreakCounter";

type ActivityType = "recipe" | "accomplishment" | "update";

type FriendActivity = {
  id: string;
  type: ActivityType;
  friend: {
    name: string;
    avatar: string;
    level: number;
    streak: number;
    badges?: string[];
  };
  timestamp: string;
  content: {
    text?: string;
    image?: string;
    title?: string;
    achievement?: string;
    icon?: string;
  };
  likes: number;
  comments: number;
  isLiked?: boolean;
};

export const FriendActivityCard = ({ 
  activity, 
  onLike, 
  onComment, 
  onWave 
}: { 
  activity: FriendActivity;
  onLike?: () => void;
  onComment?: () => void;
  onWave?: () => void;
}) => {
  const renderContent = () => {
    switch (activity.type) {
      case "recipe":
        return (
          <div className="flex gap-3">
            {activity.content.image && (
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-muted">
                <img 
                  src={activity.content.image} 
                  alt={activity.content.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground mb-1">shared a recipe</p>
              <h4 className="text-base font-semibold text-foreground mb-1 line-clamp-2">
                {activity.content.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {activity.content.text}
              </p>
            </div>
          </div>
        );

      case "accomplishment":
        return (
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-4 border-2 border-primary/30">
            <p className="text-sm text-muted-foreground mb-2">earned a badge!</p>
            <div className="flex items-center gap-3">
              <div className="text-4xl">{activity.content.icon}</div>
              <div>
                <h4 className="text-base font-bold text-foreground mb-1">
                  {activity.content.achievement}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {activity.content.text}
                </p>
              </div>
            </div>
          </div>
        );

      case "update":
        return (
          <div className="bg-muted/50 rounded-2xl p-4">
            <p className="text-sm text-foreground">
              {activity.content.text}
            </p>
            {activity.content.icon && (
              <div className="mt-2 text-2xl">
                {activity.content.icon}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-card rounded-3xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-border">
      {/* Friend Header */}
      <div className="flex items-start gap-3 mb-3">
        <img 
          src={activity.friend.avatar} 
          alt={activity.friend.name}
          className="w-10 h-10 rounded-full border-2 border-border"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-foreground">
              {activity.friend.name}
            </span>
            <span className="text-xs text-muted-foreground">
              Lvl {activity.friend.level}
            </span>
          </div>
          {/* Badges under name */}
          {activity.friend.badges && activity.friend.badges.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {activity.friend.badges.slice(0, 2).map((badge, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <StreakCounter days={activity.friend.streak} />
          <span className="text-xs text-muted-foreground">
            {activity.timestamp}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        {renderContent()}
      </div>


      {/* Interaction Bar */}
      <div className="flex items-center gap-4 pt-3 border-t border-border">
        <button 
          onClick={onLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            activity.isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Heart className={`w-4 h-4 ${activity.isLiked ? "fill-current" : ""}`} />
          <span>{activity.likes}</span>
        </button>
        
        <button 
          onClick={onComment}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{activity.comments}</span>
        </button>
        
        <button 
          onClick={onWave}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto"
        >
          <Waves className="w-4 h-4" />
          <span className="text-xs">Send Wave</span>
        </button>
      </div>
    </div>
  );
};
