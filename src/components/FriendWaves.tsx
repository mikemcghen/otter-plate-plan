import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UserPlus, Trophy, Flame, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import otterHappy from "@/assets/otter-happy.png";

interface Friend {
  id: string;
  display_name: string;
  avatar_url?: string;
  streak: number;
  xp: number;
  level: number;
  caloriePercentage?: number;
}

interface FriendWavesProps {
  friends: Friend[];
  onAddFriend: () => void;
  onFriendClick: (friend: Friend) => void;
}

export const FriendWaves = ({ friends, onAddFriend, onFriendClick }: FriendWavesProps) => {
  // Pick a random friend for spotlight (if any)
  const spotlightFriend = friends.length > 0 
    ? friends[Math.floor(Math.random() * friends.length)]
    : null;

  const getStatusColor = (percentage?: number) => {
    if (!percentage) return "hsl(var(--muted))";
    if (percentage >= 95 && percentage <= 105) return "hsl(var(--success))";
    if (percentage >= 90 && percentage <= 110) return "hsl(var(--primary))";
    return "hsl(var(--warning))";
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Friend Waves
        </h3>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {/* Ottr's Spotlight Card */}
        {spotlightFriend && (
          <Card
            className="flex-shrink-0 w-[140px] p-4 snap-start cursor-pointer active:scale-95 transition-all duration-300 hover:shadow-lg animate-bounce-subtle border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5"
            onClick={() => onFriendClick(spotlightFriend)}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="relative">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-wide">
                Ottr's Spotlight
              </div>
              <Avatar className="w-12 h-12 border-2 border-primary shadow-lg">
                <AvatarImage src={spotlightFriend.avatar_url || otterHappy} />
                <AvatarFallback>{spotlightFriend.display_name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-[11px] font-semibold text-foreground truncate w-full">
                {spotlightFriend.display_name}
              </div>
              <Badge variant="secondary" className="text-[9px] px-2 py-0.5">
                <Flame className="w-3 h-3 mr-1 text-streak" />
                {spotlightFriend.streak} day streak!
              </Badge>
            </div>
          </Card>
        )}

        {/* Friend Cards */}
        {friends.map((friend) => (
          <Card
            key={friend.id}
            className="flex-shrink-0 w-[100px] p-3 snap-start cursor-pointer active:scale-95 transition-all duration-300 hover:shadow-lg animate-bounce-subtle"
            onClick={() => onFriendClick(friend)}
          >
            <div className="flex flex-col items-center gap-2">
              {/* Activity Ring around Avatar */}
              <div className="relative">
                <svg className="w-16 h-16 -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="hsl(var(--muted))"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.2"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke={getStatusColor(friend.caloriePercentage)}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${((friend.caloriePercentage || 0) / 100) * 176} 176`}
                    strokeLinecap="round"
                    className={cn(
                      "transition-all duration-500",
                      friend.caloriePercentage && friend.caloriePercentage >= 95 && friend.caloriePercentage <= 105 && "animate-glow-pulse"
                    )}
                  />
                </svg>
                <Avatar className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12">
                  <AvatarImage src={friend.avatar_url || otterHappy} />
                  <AvatarFallback>{friend.display_name[0]}</AvatarFallback>
                </Avatar>
                {/* Status indicator */}
                {friend.caloriePercentage && friend.caloriePercentage >= 95 && friend.caloriePercentage <= 105 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-success-foreground" />
                  </div>
                )}
              </div>
              <div className="text-[11px] font-semibold text-foreground text-center truncate w-full">
                {friend.display_name}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Trophy className="w-3 h-3 text-primary" />
                Lvl {friend.level}
              </div>
            </div>
          </Card>
        ))}

        {/* Add Friend Card */}
        <Card
          className="flex-shrink-0 w-[100px] p-3 snap-start cursor-pointer active:scale-95 transition-all duration-300 hover:shadow-lg border-dashed border-2 border-primary/30 bg-primary/5 hover:bg-primary/10"
          onClick={onAddFriend}
        >
          <div className="flex flex-col items-center justify-center gap-2 h-full">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <div className="text-[11px] font-semibold text-primary text-center">
              Add Friend
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
