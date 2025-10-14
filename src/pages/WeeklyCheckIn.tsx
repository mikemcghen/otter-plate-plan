import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import otterEncourage from "@/assets/otter-encourage.png";
import { toast } from "@/hooks/use-toast";

const WeeklyCheckIn = () => {
  const navigate = useNavigate();

  const weeklyData = [
    { day: "Mon", weight: 165.2 },
    { day: "Tue", weight: 165.0 },
    { day: "Wed", weight: 164.8 },
    { day: "Thu", weight: 165.1 },
    { day: "Fri", weight: 164.9 },
    { day: "Sat", weight: 165.0 },
    { day: "Sun", weight: 164.7 },
  ];

  const maintenanceMin = 164.5;
  const maintenanceMax = 165.5;
  const avgWeight = weeklyData.reduce((sum, d) => sum + d.weight, 0) / weeklyData.length;
  const maxWeight = Math.max(...weeklyData.map((d) => d.weight));
  const minWeight = Math.min(...weeklyData.map((d) => d.weight));

  const chartHeight = 200;
  const chartPadding = 20;
  const getY = (weight: number) => {
    const range = maxWeight - minWeight + 1;
    return chartHeight - chartPadding - ((weight - minWeight + 0.5) / range) * (chartHeight - 2 * chartPadding);
  };

  const handleCompleteCheckIn = () => {
    toast({
      title: "Check-in completed! 🎉",
      description: "Keep up the amazing consistency!",
    });
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 transition-colors duration-300">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground flex-1">Weekly Check-In</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Otter Greeting */}
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border animate-scale-in">
          <div className="flex items-start gap-4">
            <img
              src={otterEncourage}
              alt="Otter mascot"
              className="w-24 h-24 object-contain"
            />
            <div className="flex-1 space-y-2">
              <h2 className="text-lg font-bold text-foreground">
                Awesome work this week! 🦦
              </h2>
              <p className="text-sm text-muted-foreground">
                You've kept things steady and stayed consistent. That's what
                healthy maintenance is all about!
              </p>
            </div>
          </div>
        </div>

        {/* Weight Stats */}
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              This Week's Trend
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {avgWeight.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Average</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {minWeight.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Low</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {maxWeight.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">High</p>
            </div>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Weekly Weight
          </h3>
          <svg
            viewBox={`0 0 ${weeklyData.length * 50} ${chartHeight}`}
            className="w-full"
          >
            {/* Maintenance zone background */}
            <rect
              x="0"
              y={getY(maintenanceMax)}
              width={weeklyData.length * 50}
              height={getY(maintenanceMin) - getY(maintenanceMax)}
              fill="hsl(var(--success) / 0.1)"
              rx="4"
            />

            {/* Grid lines */}
            {weeklyData.map((_, i) => (
              <line
                key={i}
                x1={i * 50 + 25}
                y1={chartPadding}
                x2={i * 50 + 25}
                y2={chartHeight - chartPadding}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                opacity="0.3"
              />
            ))}

            {/* Line */}
            <polyline
              points={weeklyData
                .map((d, i) => `${i * 50 + 25},${getY(d.weight)}`)
                .join(" ")}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {weeklyData.map((d, i) => (
              <circle
                key={i}
                cx={i * 50 + 25}
                cy={getY(d.weight)}
                r="5"
                fill="hsl(var(--primary))"
                stroke="hsl(var(--card))"
                strokeWidth="2"
              />
            ))}

            {/* Labels */}
            {weeklyData.map((d, i) => (
              <text
                key={i}
                x={i * 50 + 25}
                y={chartHeight - 5}
                textAnchor="middle"
                fontSize="12"
                fill="hsl(var(--muted-foreground))"
              >
                {d.day}
              </text>
            ))}
          </svg>
        </div>

        {/* Encouragement Card */}
        <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-3xl p-6 border border-success/20">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            💪 Keep it up!
          </h3>
          <p className="text-sm text-muted-foreground">
            Your weight is stable within the healthy maintenance range. Continue
            with your current eating habits and stay consistent!
          </p>
        </div>

        {/* Complete Button */}
        <Button
          onClick={handleCompleteCheckIn}
          className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-base font-semibold"
        >
          Complete Check-In
        </Button>
      </main>
    </div>
  );
};

export default WeeklyCheckIn;
