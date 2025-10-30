import { useNavigate } from "react-router-dom";
import { TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

export const WeeklyTrendMini = () => {
  const navigate = useNavigate();
  
  // Mock data for sparkline
  const weekData = [65, 78, 82, 90, 85, 95, 88]; // Percentages for 7 days
  const daysLogged = 5;
  const totalDays = 7;

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-2 border-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-base font-bold text-foreground">
            This Week's Flow
          </h3>
        </div>
      </div>

      {/* Sparkline visualization */}
      <div className="relative h-16 mb-4">
        <svg 
          viewBox="0 0 140 40" 
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Background area */}
          <defs>
            <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Line path */}
          <path
            d={`M 0 ${40 - (weekData[0] * 0.4)} ${weekData.map((val, i) => 
              `L ${(i * 20) + 10} ${40 - (val * 0.4)}`
            ).join(' ')}`}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />

          {/* Fill area */}
          <path
            d={`M 0 40 L 0 ${40 - (weekData[0] * 0.4)} ${weekData.map((val, i) => 
              `L ${(i * 20) + 10} ${40 - (val * 0.4)}`
            ).join(' ')} L ${(weekData.length - 1) * 20 + 10} 40 Z`}
            fill="url(#sparklineGradient)"
          />

          {/* Dots */}
          {weekData.map((val, i) => (
            <circle
              key={i}
              cx={(i * 20) + 10}
              cy={40 - (val * 0.4)}
              r="2"
              fill="hsl(var(--primary))"
            />
          ))}
        </svg>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Steady as a river</span> — you've logged {daysLogged}/{totalDays} days this week! 🌊
        </p>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/weekly-check-in")}
          className="w-full justify-between group hover:bg-muted/50"
        >
          <span className="text-sm font-medium">View Full Check-In</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};
