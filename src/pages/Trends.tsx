import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Flame, Award, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MacroRing } from "@/components/MacroRing";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { EmptyState } from "@/components/EmptyState";
import { useAppContext } from "@/contexts/AppContext";
import otterHappy from "@/assets/otter-happy.png";

const Trends = () => {
  const navigate = useNavigate();
  const { foodLogs, streak } = useAppContext();

  // Check if user has any data
  const hasData = foodLogs.length > 0 || streak > 0;

  // Mock data for weekly consistency
  const weeklyData = [
    { day: "Mon", calories: 1950, logged: true },
    { day: "Tue", calories: 2100, logged: true },
    { day: "Wed", calories: 1850, logged: true },
    { day: "Thu", calories: 2050, logged: true },
    { day: "Fri", calories: 1900, logged: true },
    { day: "Sat", calories: 2200, logged: true },
    { day: "Sun", calories: 1950, logged: true },
  ];

  const caloriesTarget = 2000;
  const maintenanceMin = 1800;
  const maintenanceMax = 2200;

  const chartHeight = 180;
  const chartPadding = 20;
  const maxCalories = Math.max(...weeklyData.map((d) => d.calories), maintenanceMax);
  const minCalories = Math.min(...weeklyData.map((d) => d.calories), maintenanceMin);

  const getY = (calories: number) => {
    const range = maxCalories - minCalories;
    return chartHeight - chartPadding - ((calories - minCalories) / range) * (chartHeight - 2 * chartPadding);
  };

  // Mock streak data
  const currentStreak = 12;
  const longestStreak = 18;
  const totalXP = 4850;
  const currentLevel = 8;

  // Mock most logged foods
  const mostLoggedFoods = [
    { name: "Greek Yogurt", count: 15, emoji: "🫐", calories: 150 },
    { name: "Chicken Breast", count: 12, emoji: "🍗", calories: 280 },
    { name: "Brown Rice", count: 10, emoji: "🍚", calories: 215 },
    { name: "Banana", count: 9, emoji: "🍌", calories: 105 },
    { name: "Avocado Toast", count: 8, emoji: "🥑", calories: 320 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full hover:bg-muted active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground flex-1">Your Trends</h1>
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6 pb-6">
        {!hasData ? (
          <div className="bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
            <EmptyState
              variant="sleepy"
              title="No trends to show yet"
              description="Start logging your meals and weigh-ins to see your beautiful progress over time. Ottr can't wait to celebrate your journey!"
              action={{
                label: "Start Tracking",
                onClick: () => navigate("/"),
              }}
              icon={<TrendingUp className="w-12 h-12" />}
            />
          </div>
        ) : (
          <>
        {/* Otter Encouragement */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border animate-fade-in">
          <div className="flex items-start gap-4">
            <img
              src={otterHappy}
              alt="Happy otter"
              className="w-20 h-20 object-contain"
            />
            <div className="flex-1 space-y-2">
              <h2 className="text-lg font-bold text-foreground">
                You're on fire! 🔥
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentStreak} days logged in a row! Keep up this amazing consistency.
              </p>
            </div>
          </div>
        </div>

        {/* Streak & XP Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border text-center">
            <Flame className="w-6 h-6 text-streak mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{currentStreak}</p>
            <p className="text-xs text-muted-foreground mt-1">Day Streak</p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border text-center">
            <Crown className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{longestStreak}</p>
            <p className="text-xs text-muted-foreground mt-1">Best Streak</p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border text-center">
            <Award className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{totalXP}</p>
            <p className="text-xs text-muted-foreground mt-1">Total XP</p>
          </div>
        </div>

        {/* Weekly Calorie Consistency */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-foreground">
              Weekly Consistency
            </h3>
            <span className="text-sm font-semibold text-success">
              7/7 days logged
            </span>
          </div>
          
          <svg
            viewBox={`0 0 ${weeklyData.length * 50} ${chartHeight}`}
            className="w-full mb-2"
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

            {/* Target line */}
            <line
              x1="0"
              y1={getY(caloriesTarget)}
              x2={weeklyData.length * 50}
              y2={getY(caloriesTarget)}
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.5"
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
                .map((d, i) => `${i * 50 + 25},${getY(d.calories)}`)
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
                cy={getY(d.calories)}
                r="5"
                fill={d.logged ? "hsl(var(--primary))" : "hsl(var(--muted))"}
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

          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>Daily intake</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-8 h-2 bg-success/20 rounded"></div>
              <span>Maintenance zone</span>
            </div>
          </div>
        </div>

        {/* Average Macros */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
          <h3 className="text-base font-bold text-foreground mb-4">
            Weekly Average Macros
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <MacroRing
              label="Protein"
              current={102}
              target={120}
              color="hsl(var(--primary))"
            />
            <MacroRing
              label="Carbs"
              current={185}
              target={200}
              color="hsl(var(--accent))"
            />
            <MacroRing
              label="Fat"
              current={54}
              target={60}
              color="hsl(var(--success))"
            />
          </div>
        </div>

        {/* Most Logged Foods */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
          <h3 className="text-base font-bold text-foreground mb-4">
            Most Logged Foods
          </h3>
          <div className="space-y-3">
            {mostLoggedFoods.map((food, index) => (
              <div
                key={food.name}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-background rounded-full text-2xl">
                  {food.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {food.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {food.calories} cal
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {food.count}
                  </p>
                  <p className="text-xs text-muted-foreground">times</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Card */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-6 border-2 border-primary/30">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full">
              <Award className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-foreground mb-1">
                Level {currentLevel} Achiever
              </h3>
              <p className="text-sm text-muted-foreground">
                You're in the top 10% of OttrCal users! Keep building those healthy habits.
              </p>
            </div>
          </div>
        </div>
        </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Trends;
