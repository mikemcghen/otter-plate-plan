import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Heart, Share2, ChefHat, Flame, Sparkles } from "lucide-react";
import otterHappy from "@/assets/otter-happy.png";

interface Badge {
  id: string;
  name: string;
  icon_name: string;
}

interface FriendCardProps {
  friend: {
    id: string;
    display_name: string;
    avatar_url?: string;
    title: string;
    level?: number;
    xp?: number;
    streak?: number;
    favorite_badge?: Badge;
  };
  onSendEncouragement: () => void;
  onShareRecipe: () => void;
  onShareSnack: () => void;
}

export const FriendCard = ({ 
  friend, 
  onSendEncouragement, 
  onShareRecipe, 
  onShareSnack 
}: FriendCardProps) => {
  const maxXP = 100;
  const xpPercentage = ((friend.xp || 0) / maxXP) * 100;

  return (
    <div className="bg-card rounded-2xl p-4 border-2 border-border shadow-[0_4px_20px_rgb(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.3)] space-y-3">
      {/* Friend Header */}
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={friend.avatar_url || otterHappy} alt={friend.display_name} />
          <AvatarFallback>{friend.display_name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-foreground truncate">
            {friend.display_name}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {friend.title}
          </p>
        </div>

        {/* Streak Badge */}
        {friend.streak && friend.streak > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-streak/15 border border-streak/30">
            <Flame className="w-3 h-3 text-streak" />
            <span className="text-xs font-bold text-streak">{friend.streak}</span>
          </div>
        )}
      </div>

      {/* Level & XP */}
      {friend.level && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Level {friend.level}
            </span>
            <span className="text-muted-foreground">
              {friend.xp || 0}/{maxXP} XP
            </span>
          </div>
          <Progress value={xpPercentage} className="h-1.5" />
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={onSendEncouragement}
        >
          <Heart className="w-3 h-3 mr-1" />
          Cheer
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={onShareRecipe}
        >
          <ChefHat className="w-3 h-3 mr-1" />
          Recipe
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={onShareSnack}
        >
          <Share2 className="w-3 h-3 mr-1" />
          Snack
        </Button>
      </div>
    </div>
  );
};
