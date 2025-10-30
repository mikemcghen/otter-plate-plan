import { Flame, Award, TrendingUp } from "lucide-react";

type HighlightType = "streak" | "badge" | "milestone";

type FriendHighlight = {
  id: string;
  type: HighlightType;
  friend: {
    name: string;
    avatar: string;
  };
  title: string;
  description: string;
  icon: string;
};

export const FriendHighlightCard = ({ highlight }: { highlight: FriendHighlight }) => {
  const getGradient = () => {
    switch (highlight.type) {
      case "streak":
        return "from-streak/20 to-streak/5";
      case "badge":
        return "from-primary/20 to-accent/10";
      case "milestone":
        return "from-success/20 to-success/5";
      default:
        return "from-primary/10 to-accent/10";
    }
  };

  const getIcon = () => {
    switch (highlight.type) {
      case "streak":
        return <Flame className="w-5 h-5 text-streak" />;
      case "badge":
        return <Award className="w-5 h-5 text-primary" />;
      case "milestone":
        return <TrendingUp className="w-5 h-5 text-success" />;
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getGradient()} rounded-3xl p-4 border-2 border-border/50 min-w-[280px] flex-shrink-0 shadow-[0_4px_20px_rgb(0,0,0,0.06)]`}>
      <div className="flex items-start gap-3 mb-3">
        <img 
          src={highlight.friend.avatar} 
          alt={highlight.friend.name}
          className="w-10 h-10 rounded-full border-2 border-border"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {getIcon()}
            <span className="text-sm font-bold text-foreground truncate">
              {highlight.friend.name}
            </span>
          </div>
          <h4 className="text-base font-semibold text-foreground mb-1">
            {highlight.title}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {highlight.description}
          </p>
        </div>
      </div>
      <div className="text-3xl text-center">
        {highlight.icon}
      </div>
    </div>
  );
};
