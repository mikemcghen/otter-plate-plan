import { 
  Footprints, Flame, Target, Heart, ChefHat, Trophy, Sparkles, Users,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  category: string;
  unlock_criteria: string;
  points_required: number;
}

interface BadgeCardProps {
  badge: Badge;
  unlocked: boolean;
  isFavorite?: boolean;
  onUnlock?: () => void;
  onSetFavorite?: () => void;
}

const iconMap: Record<string, any> = {
  Footprints,
  Flame,
  Target,
  Heart,
  ChefHat,
  Trophy,
  Sparkles,
  Users,
};

export const BadgeCard = ({ badge, unlocked, isFavorite, onUnlock, onSetFavorite }: BadgeCardProps) => {
  const Icon = iconMap[badge.icon_name] || Sparkles;
  
  return (
    <div
      className={cn(
        "relative bg-card rounded-2xl p-4 border-2 transition-all duration-300",
        unlocked 
          ? "border-primary shadow-[0_4px_20px_rgb(0,0,0,0.06)] hover:scale-105 cursor-pointer" 
          : "border-border opacity-60 grayscale"
      )}
      onClick={unlocked && onSetFavorite ? onSetFavorite : undefined}
    >
      {/* Favorite Star */}
      {isFavorite && unlocked && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-pulse">
          <Sparkles className="w-3 h-3 text-primary-foreground fill-current" />
        </div>
      )}

      {/* Lock Icon */}
      {!unlocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      {/* Badge Icon */}
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center mb-3",
        unlocked ? "bg-primary/10" : "bg-muted"
      )}>
        <Icon className={cn(
          "w-6 h-6",
          unlocked ? "text-primary" : "text-muted-foreground"
        )} />
      </div>

      {/* Badge Info */}
      <h4 className="text-sm font-bold text-foreground mb-1">{badge.name}</h4>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
        {badge.description}
      </p>
      
      {/* Unlock Criteria */}
      <div className="text-xs text-muted-foreground">
        {badge.unlock_criteria}
      </div>

      {/* Points Badge */}
      {badge.points_required > 0 && (
        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
          <Sparkles className="w-3 h-3" />
          {badge.points_required} XP
        </div>
      )}
    </div>
  );
};
