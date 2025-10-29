import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MobileBottomNav } from "@/components/MobileBottomNav";

const StateFlowDiagram = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-24">
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground flex-1">
            🛠️ State Flow Diagram
          </h1>
          <span className="text-xs bg-warning/20 text-warning-foreground px-3 py-1 rounded-full font-semibold">
            Dev Only
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Overview */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
          <h2 className="text-lg font-bold text-foreground mb-3">
            OttrCal State Flow Overview
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            This diagram shows how user actions trigger state updates, which then trigger UI reactions and notifications in the mobile app.
          </p>
          <div className="bg-muted/50 rounded-xl p-4 text-xs space-y-2">
            <p className="font-semibold text-foreground">Key Components:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li><strong>User Actions:</strong> Quick Log, Weigh-In, Snack Selection</li>
              <li><strong>State Updates:</strong> Calories, Macros, XP, Level, Streak</li>
              <li><strong>UI Reactions:</strong> Ring updates, Ottr animations, confetti</li>
              <li><strong>Notifications:</strong> Snack reminders, level up, streak updates</li>
            </ul>
          </div>
        </div>

        {/* State Flow Diagram */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border overflow-x-auto">
          <h2 className="text-lg font-bold text-foreground mb-4">
            State Flow Architecture
          </h2>
          
          {/* Visual Flow */}
          <div className="space-y-4">
            {/* User Actions */}
            <div className="border-2 border-primary/30 rounded-2xl p-4 bg-primary/5">
              <h3 className="text-sm font-bold text-primary mb-3">👤 User Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="bg-card rounded-lg p-3 border border-primary/20 text-center">
                  <div className="text-2xl mb-1">🍽️</div>
                  <p className="text-xs font-semibold">Quick Log Food</p>
                </div>
                <div className="bg-card rounded-lg p-3 border border-primary/20 text-center">
                  <div className="text-2xl mb-1">⚖️</div>
                  <p className="text-xs font-semibold">Weigh-In</p>
                </div>
                <div className="bg-card rounded-lg p-3 border border-primary/20 text-center">
                  <div className="text-2xl mb-1">🍪</div>
                  <p className="text-xs font-semibold">Pick Snack</p>
                </div>
                <div className="bg-card rounded-lg p-3 border border-primary/20 text-center">
                  <div className="text-2xl mb-1">🌅</div>
                  <p className="text-xs font-semibold">Open App</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="text-2xl">⬇️</div>
            </div>

            {/* State Updates */}
            <div className="border-2 border-cyan-500/30 rounded-2xl p-4 bg-cyan-500/5">
              <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mb-3">📊 AppContext State Updates</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div className="bg-card rounded-lg p-2 border border-cyan-500/20">
                  <p className="text-xs font-semibold">Update Calories</p>
                  <p className="text-[10px] text-muted-foreground">+food.calories</p>
                </div>
                <div className="bg-card rounded-lg p-2 border border-cyan-500/20">
                  <p className="text-xs font-semibold">Update Macros</p>
                  <p className="text-[10px] text-muted-foreground">P/C/F values</p>
                </div>
                <div className="bg-card rounded-lg p-2 border border-cyan-500/20">
                  <p className="text-xs font-semibold">Add XP</p>
                  <p className="text-[10px] text-muted-foreground">+15 per log</p>
                </div>
                <div className="bg-card rounded-lg p-2 border border-cyan-500/20">
                  <p className="text-xs font-semibold">Check Perfect</p>
                  <p className="text-[10px] text-muted-foreground">95-105% target</p>
                </div>
                <div className="bg-card rounded-lg p-2 border border-cyan-500/20">
                  <p className="text-xs font-semibold">Bonus XP</p>
                  <p className="text-[10px] text-muted-foreground">+50 if perfect</p>
                </div>
                <div className="bg-card rounded-lg p-2 border border-cyan-500/20">
                  <p className="text-xs font-semibold">Level Check</p>
                  <p className="text-[10px] text-muted-foreground">XP threshold</p>
                </div>
                <div className="bg-card rounded-lg p-2 border border-cyan-500/20">
                  <p className="text-xs font-semibold">Update Streak</p>
                  <p className="text-[10px] text-muted-foreground">Daily check</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="text-2xl">⬇️</div>
            </div>

            {/* UI Reactions */}
            <div className="border-2 border-green-500/30 rounded-2xl p-4 bg-green-500/5">
              <h3 className="text-sm font-bold text-green-600 dark:text-green-400 mb-3">✨ UI Reactions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div className="bg-card rounded-lg p-2 border border-green-500/20">
                  <p className="text-xs font-semibold">🔄 Ring Updates</p>
                  <p className="text-[10px] text-muted-foreground">Animate to new %</p>
                </div>
                <div className="bg-card rounded-lg p-2 border border-green-500/20">
                  <p className="text-xs font-semibold">⚡ XP Bar Fill</p>
                  <p className="text-[10px] text-muted-foreground">Shimmer effect</p>
                </div>
                <div className="bg-card rounded-lg p-2 border border-green-500/20">
                  <p className="text-xs font-semibold">🦦 Ottr Mood</p>
                  <p className="text-[10px] text-muted-foreground">Context reaction</p>
                </div>
                <div className="bg-card rounded-lg p-2 border border-green-500/20">
                  <p className="text-xs font-semibold">🎉 Confetti</p>
                  <p className="text-[10px] text-muted-foreground">Perfect day</p>
                </div>
                <div className="bg-card rounded-lg p-2 border border-green-500/20">
                  <p className="text-xs font-semibold">🏆 Level Up</p>
                  <p className="text-[10px] text-muted-foreground">Modal + trophy</p>
                </div>
                <div className="bg-card rounded-lg p-2 border border-green-500/20">
                  <p className="text-xs font-semibold">🔥 Streak Badge</p>
                  <p className="text-[10px] text-muted-foreground">Update display</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="text-2xl">⬇️</div>
            </div>

            {/* Notifications */}
            <div className="border-2 border-orange-500/30 rounded-2xl p-4 bg-orange-500/5">
              <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-3">🔔 Notifications & Triggers</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="bg-card rounded-lg p-2 border border-orange-500/20">
                  <p className="text-xs font-semibold">🍪 Snack</p>
                  <p className="text-[10px] text-muted-foreground">&lt;85% afternoon</p>
                </div>
                <div className="bg-card rounded-lg p-2 border border-orange-500/20">
                  <p className="text-xs font-semibold">⚠️ Low Cal</p>
                  <p className="text-[10px] text-muted-foreground">Ottr suggests</p>
                </div>
                <div className="bg-card rounded-lg p-2 border border-orange-500/20">
                  <p className="text-xs font-semibold">👋 Greeting</p>
                  <p className="text-[10px] text-muted-foreground">Daily streak</p>
                </div>
                <div className="bg-card rounded-lg p-2 border border-orange-500/20">
                  <p className="text-xs font-semibold">🌙 Summary</p>
                  <p className="text-[10px] text-muted-foreground">End of day</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* State Management Details */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* XP System */}
          <div className="bg-card rounded-2xl p-5 shadow-md border-2 border-border">
            <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              ⚡ XP & Level System
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                <p className="font-semibold text-foreground mb-1">XP Sources:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                  <li>+15 XP per food log</li>
                  <li>+50 XP for perfect day (95-105% target)</li>
                  <li>+15 XP per weigh-in</li>
                </ul>
              </div>
              <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
                <p className="font-semibold text-foreground mb-1">Level Up Logic:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                  <li>XP Needed = Level × 100</li>
                  <li>Level 1 → 2: 100 XP</li>
                  <li>Level 2 → 3: 200 XP</li>
                  <li>Overflow XP carries to next level</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Streak System */}
          <div className="bg-card rounded-2xl p-5 shadow-md border-2 border-border">
            <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              🔥 Streak System
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="bg-streak/10 rounded-lg p-3 border border-streak/20">
                <p className="font-semibold text-foreground mb-1">Streak Logic:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                  <li>Tracks last app visit date</li>
                  <li>Same day: No change</li>
                  <li>Next day: Streak +1</li>
                  <li>Missed days: Reset to 1 (gentle)</li>
                </ul>
              </div>
              <div className="bg-success/10 rounded-lg p-3 border border-success/20">
                <p className="font-semibold text-foreground mb-1">Milestones:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                  <li>7+ days: ✨ badge appears</li>
                  <li>Daily greeting shows streak</li>
                  <li>Ottr celebrates consistency</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ottr Reactions */}
          <div className="bg-card rounded-2xl p-5 shadow-md border-2 border-border">
            <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              🦦 Ottr Mood Logic
            </h3>
            <div className="space-y-2 text-sm">
              <div className="bg-muted/50 rounded-lg p-2 border border-border">
                <p className="font-semibold text-foreground text-xs mb-1">😴 Sleepy (Under)</p>
                <p className="text-xs text-muted-foreground">Calories &lt; 90% target</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2 border border-border">
                <p className="font-semibold text-foreground text-xs mb-1">😊 Happy (Maintenance)</p>
                <p className="text-xs text-muted-foreground">90-110% target</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2 border border-border">
                <p className="font-semibold text-foreground text-xs mb-1">🎉 Joyful (Perfect)</p>
                <p className="text-xs text-muted-foreground">95-105% target</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2 border border-border">
                <p className="font-semibold text-foreground text-xs mb-1">😬 Concerned (Over)</p>
                <p className="text-xs text-muted-foreground">Calories &gt; 110% target</p>
              </div>
            </div>
          </div>

          {/* Notification Triggers */}
          <div className="bg-card rounded-2xl p-5 shadow-md border-2 border-border">
            <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              🔔 Notification Triggers
            </h3>
            <div className="space-y-2 text-sm">
              <div className="bg-warning/10 rounded-lg p-2 border border-warning/20">
                <p className="font-semibold text-foreground text-xs mb-1">🍪 Snack Reminder</p>
                <p className="text-xs text-muted-foreground">
                  Triggers if &lt;85% calories by 2pm-6pm
                </p>
              </div>
              <div className="bg-primary/10 rounded-lg p-2 border border-primary/20">
                <p className="font-semibold text-foreground text-xs mb-1">👋 Daily Greeting</p>
                <p className="text-xs text-muted-foreground">
                  Shows on first app open each day
                </p>
              </div>
              <div className="bg-accent/10 rounded-lg p-2 border border-accent/20">
                <p className="font-semibold text-foreground text-xs mb-1">🌙 End of Day</p>
                <p className="text-xs text-muted-foreground">
                  Manual trigger via moon button
                </p>
              </div>
              <div className="bg-success/10 rounded-lg p-2 border border-success/20">
                <p className="font-semibold text-foreground text-xs mb-1">🏆 Level Up</p>
                <p className="text-xs text-muted-foreground">
                  Auto-triggers when XP threshold met
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Notes */}
        <div className="bg-gradient-to-br from-warning/5 to-warning/10 rounded-3xl p-6 border-2 border-warning/30">
          <h3 className="text-base font-bold text-foreground mb-3">
            💡 Implementation Notes
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground text-xs mb-1">State Management:</p>
              <p className="text-xs">All state is managed in <code className="bg-muted px-1 py-0.5 rounded">AppContext</code> and persisted to localStorage</p>
            </div>
            <div>
              <p className="font-semibold text-foreground text-xs mb-1">Real-time Updates:</p>
              <p className="text-xs">Dashboard subscribes to context and updates instantly on any state change</p>
            </div>
            <div>
              <p className="font-semibold text-foreground text-xs mb-1">Animations:</p>
              <p className="text-xs">All transitions &lt;300ms for mobile responsiveness with haptic feedback</p>
            </div>
            <div>
              <p className="font-semibold text-foreground text-xs mb-1">Mobile-First:</p>
              <p className="text-xs">Touch-optimized, gesture-based, thumb-reach focused UI patterns</p>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default StateFlowDiagram;
