import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Flame, Award, Crown, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MacroRing } from "@/components/MacroRing";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { EmptyState } from "@/components/EmptyState";
import { useAppContext } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OtterMascot } from "@/components/OtterMascot";
import otterHappy from "@/assets/otter-happy.png";

type ViewMode = "mine" | "friends";

type FriendData = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  weeklyData: {
    nutrition: number;
    hydration: number;
    movement: number;
  };
};

const Trends = () => {
  const navigate = useNavigate();
  const { foodLogs, streak } = useAppContext();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("mine");
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [showOtterMessage, setShowOtterMessage] = useState(false);

  // Check if user has any data
  const hasData = foodLogs.length > 0 || streak > 0;

  // Fetch friends data
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;

      const { data: friendships, error } = await supabase
        .from("friendships")
        .select(`
          friend_id,
          profiles!friendships_friend_id_fkey(
            id,
            display_name,
            avatar_url,
            show_badges_to_friends
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "accepted");

      if (error) {
        console.error("Error fetching friends:", error);
        return;
      }

      // Mock weekly data for friends (in real app, this would come from their actual logs)
      const friendsData: FriendData[] = (friendships || [])
        .filter((f) => f.profiles?.show_badges_to_friends)
        .map((friendship) => ({
          id: friendship.profiles!.id,
          display_name: friendship.profiles!.display_name,
          avatar_url: friendship.profiles!.avatar_url,
          weeklyData: {
            nutrition: Math.floor(Math.random() * 30) + 70, // 70-100%
            hydration: Math.floor(Math.random() * 30) + 70, // 70-100%
            movement: Math.floor(Math.random() * 4) + 4, // 4-7 days
          },
        }));

      setFriends(friendsData);
      setSelectedFriends(friendsData.map((f) => f.id));
    };

    fetchFriends();
  }, [user]);

  // Handle view mode toggle
  const handleViewModeToggle = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "friends") {
      setShowOtterMessage(true);
      setTimeout(() => setShowOtterMessage(false), 3000);
    }
  };

  // Toggle friend selection
  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  // Calculate friend averages for selected friends
  const friendAverages = friends
    .filter((f) => selectedFriends.includes(f.id))
    .reduce(
      (acc, friend) => ({
        nutrition: acc.nutrition + friend.weeklyData.nutrition,
        hydration: acc.hydration + friend.weeklyData.hydration,
        movement: acc.movement + friend.weeklyData.movement,
        count: acc.count + 1,
      }),
      { nutrition: 0, hydration: 0, movement: 0, count: 0 }
    );

  const avgFriendData = friendAverages.count > 0
    ? {
        nutrition: Math.round(friendAverages.nutrition / friendAverages.count),
        hydration: Math.round(friendAverages.hydration / friendAverages.count),
        movement: Math.round(friendAverages.movement / friendAverages.count),
      }
    : null;

  // Mock data for weekly consistency
  const weeklyData = [
    { day: "Mon", calories: 1950, logged: true, nutrition: 85, hydration: 90, movement: true },
    { day: "Tue", calories: 2100, logged: true, nutrition: 78, hydration: 85, movement: true },
    { day: "Wed", calories: 1850, logged: true, nutrition: 82, hydration: 88, movement: false },
    { day: "Thu", calories: 2050, logged: true, nutrition: 90, hydration: 92, movement: true },
    { day: "Fri", calories: 1900, logged: true, nutrition: 75, hydration: 80, movement: true },
    { day: "Sat", calories: 2200, logged: true, nutrition: 88, hydration: 95, movement: true },
    { day: "Sun", calories: 1950, logged: true, nutrition: 80, hydration: 85, movement: false },
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
          <h1 className="text-xl font-bold text-foreground flex-1">
            {viewMode === "mine" ? "Your Trends" : "Friends Wave"}
          </h1>
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>

        {/* View Mode Toggle */}
        {hasData && (
          <div className="max-w-md mx-auto px-4 pb-3">
            <div className="flex gap-2 bg-muted rounded-2xl p-1">
              <button
                onClick={() => handleViewModeToggle("mine")}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  viewMode === "mine"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                My Week
              </button>
              <button
                onClick={() => handleViewModeToggle("friends")}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  viewMode === "friends"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                <Waves className="w-4 h-4 inline mr-1" />
                Friends Wave
              </button>
            </div>
          </div>
        )}
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
        {/* Ottr Message for Friends Mode */}
        {viewMode === "friends" && showOtterMessage && (
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-5 border-2 border-primary/30 animate-slide-in-right">
            <OtterMascot mood="joyful" message="Your friends are making waves! 🌊" />
          </div>
        )}

        {/* Friend Selection Avatars */}
        {viewMode === "friends" && friends.length > 0 && (
          <div className="bg-card rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border animate-fade-in">
            <h3 className="text-sm font-semibold text-foreground mb-3">Select Friends</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {friends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => toggleFriendSelection(friend.id)}
                  className={`flex-shrink-0 transition-all duration-300 ${
                    selectedFriends.includes(friend.id)
                      ? "scale-110"
                      : "opacity-50 grayscale"
                  }`}
                >
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-border">
                      <AvatarImage src={friend.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {friend.display_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {selectedFriends.includes(friend.id) && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-card animate-scale-in">
                        <span className="text-xs text-primary-foreground">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-foreground mt-1 text-center truncate w-14">
                    {friend.display_name.split(" ")[0]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Friend Averages Card */}
        {viewMode === "friends" && avgFriendData && (
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-5 border-2 border-primary/20 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Waves className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-foreground">Group Average</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{avgFriendData.nutrition}%</p>
                <p className="text-xs text-muted-foreground mt-1">Nutrition</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{avgFriendData.hydration}%</p>
                <p className="text-xs text-muted-foreground mt-1">Hydration</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{avgFriendData.movement}</p>
                <p className="text-xs text-muted-foreground mt-1">Move Days</p>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-3">
              🦦 You and {selectedFriends.length} {selectedFriends.length === 1 ? "friend" : "friends"} staying balanced together!
            </p>
          </div>
        )}

        {/* Otter Encouragement */}
        {viewMode === "mine" && (
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
        )}

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
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-foreground">
              {viewMode === "mine" ? "Weekly Consistency" : "Shared Progress"}
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

            {/* Friend overlay lines (translucent) */}
            {viewMode === "friends" && avgFriendData && (
              <>
                <polyline
                  points={weeklyData
                    .map((d, i) => `${i * 50 + 25},${getY(caloriesTarget * (avgFriendData.nutrition / 100))}`)
                    .join(" ")}
                  fill="none"
                  stroke="hsl(var(--accent))"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  opacity="0.4"
                  className="transition-all duration-500"
                />
              </>
            )}

            {/* User's line (bold) */}
            <polyline
              points={weeklyData
                .map((d, i) => `${i * 50 + 25},${getY(d.calories)}`)
                .join(" ")}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={viewMode === "friends" ? "4" : "3"}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />

            {/* Data points */}
            {weeklyData.map((d, i) => (
              <circle
                key={i}
                cx={i * 50 + 25}
                cy={getY(d.calories)}
                r={viewMode === "friends" ? "6" : "5"}
                fill={d.logged ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                stroke="hsl(var(--card))"
                strokeWidth="2"
                className="transition-all duration-300"
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
              <span>{viewMode === "mine" ? "Daily intake" : "Your data"}</span>
            </div>
            {viewMode === "friends" && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-1 bg-accent/40 rounded"></div>
                <span>Friends avg</span>
              </div>
            )}
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
