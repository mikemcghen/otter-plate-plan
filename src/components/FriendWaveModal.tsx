import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Waves, Eye, X } from "lucide-react";
import { StreakCounter } from "./StreakCounter";
import { Badge } from "./ui/badge";

type FriendWaveModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friend: {
    display_name: string;
    avatar_url: string;
    level: number;
    streak: number;
    caloriePercentage: number;
  } | null;
  onSendWave: () => void;
  onViewPost: () => void;
};

export const FriendWaveModal = ({ 
  open, 
  onOpenChange, 
  friend, 
  onSendWave, 
  onViewPost 
}: FriendWaveModalProps) => {
  if (!friend) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl p-6 gap-6">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Friend Header */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="relative">
            <img 
              src={friend.avatar_url} 
              alt={friend.display_name}
              className="w-20 h-20 rounded-full border-4 border-primary/20"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
              {friend.level}
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">
              {friend.display_name}
            </h3>
            <StreakCounter days={friend.streak} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-muted/50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Today's Progress</span>
            <Badge variant={friend.caloriePercentage >= 90 && friend.caloriePercentage <= 110 ? "default" : "secondary"}>
              {friend.caloriePercentage}%
            </Badge>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(friend.caloriePercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button 
            onClick={() => {
              onSendWave();
              onOpenChange(false);
            }}
            className="w-full gap-2"
          >
            <Waves className="w-4 h-4" />
            Send Wave 🌊
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              onViewPost();
              onOpenChange(false);
            }}
            className="w-full gap-2"
          >
            <Eye className="w-4 h-4" />
            View Their Latest Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
