import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useState } from "react";

const StateFlowDiagram = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"flow" | "stickers">("flow");

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
            🛠️ Dev Reference
          </h1>
          <span className="text-xs bg-warning/20 text-warning-foreground px-3 py-1 rounded-full font-semibold">
            Dev Only
          </span>
        </div>
        
        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto px-4 pb-3 flex gap-2">
          <Button
            variant={activeTab === "flow" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("flow")}
            className="rounded-full"
          >
            📊 State Flow
          </Button>
          <Button
            variant={activeTab === "stickers" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("stickers")}
            className="rounded-full"
          >
            🌈 Sticker Reference
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {activeTab === "flow" && (
          <>
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
        </>
        )}

        {activeTab === "stickers" && (
          <>
            {/* Sticker Reference Overview */}
            <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
              <h2 className="text-lg font-bold text-foreground mb-3">
                🌈 Sticker System Overview
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                OttrCal stickers combine RARITY (energy/emotion) and TIER (form/depth) to create a progression system that feels magical and rewarding.
              </p>
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 text-xs space-y-2">
                <p className="font-semibold text-foreground">Naming Convention:</p>
                <p className="text-muted-foreground ml-2">[RARITY ADJECTIVE] + [TIER NOUN]</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-card px-3 py-1 rounded-full border border-border">Drifting Tide</span>
                  <span className="bg-card px-3 py-1 rounded-full border border-border">Flowing Ripple</span>
                  <span className="bg-card px-3 py-1 rounded-full border border-border">Luminous Wave</span>
                  <span className="bg-card px-3 py-1 rounded-full border border-border">Auroral Surge</span>
                  <span className="bg-card px-3 py-1 rounded-full border border-border">Mythical Crest</span>
                </div>
              </div>
            </div>

            {/* Rarity System */}
            <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
              <h2 className="text-lg font-bold text-foreground mb-4">
                🌈 RARITY (Energy / Spirit)
              </h2>
              <p className="text-xs text-muted-foreground mb-4">Defines light, emotion, color complexity, and finish</p>
              
              <div className="space-y-3">
                {/* Drifting */}
                <div className="bg-muted/30 rounded-xl p-4 border-2 border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">1️⃣</span>
                    <h3 className="font-bold text-sm">Drifting</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="font-semibold">Tone:</span> Calm, grounded, beginner-friendly</div>
                    <div><span className="font-semibold">Colors:</span> Muted lavender, soft teal, off-white</div>
                    <div><span className="font-semibold">Finish:</span> Matte, paper-textured</div>
                    <div><span className="font-semibold">Motion:</span> Static, no motion</div>
                  </div>
                </div>

                {/* Flowing */}
                <div className="bg-blue-500/5 rounded-xl p-4 border-2 border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">2️⃣</span>
                    <h3 className="font-bold text-sm">Flowing</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="font-semibold">Tone:</span> Gentle motion, steady progress</div>
                    <div><span className="font-semibold">Colors:</span> Cool blues, gentle gradients</div>
                    <div><span className="font-semibold">Finish:</span> Slight satin sheen</div>
                    <div><span className="font-semibold">Motion:</span> Slow linear shimmer (3–5s loop)</div>
                  </div>
                </div>

                {/* Luminous */}
                <div className="bg-yellow-500/5 rounded-xl p-4 border-2 border-yellow-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">3️⃣</span>
                    <h3 className="font-bold text-sm">Luminous</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="font-semibold">Tone:</span> Balanced mastery, inner glow</div>
                    <div><span className="font-semibold">Colors:</span> Warm golds, radiant purples</div>
                    <div><span className="font-semibold">Finish:</span> Soft inner light glow</div>
                    <div><span className="font-semibold">Motion:</span> Gentle pulse (breathing, 3s in/out)</div>
                  </div>
                </div>

                {/* Auroral */}
                <div className="bg-gradient-to-r from-teal-500/5 via-purple-500/5 to-pink-500/5 rounded-xl p-4 border-2 border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">4️⃣</span>
                    <h3 className="font-bold text-sm">Auroral</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="font-semibold">Tone:</span> Magical, ethereal, rare</div>
                    <div><span className="font-semibold">Colors:</span> Iridescent (teal → coral → violet)</div>
                    <div><span className="font-semibold">Finish:</span> Layered gradient sheen</div>
                    <div><span className="font-semibold">Motion:</span> Subtle aurora shimmer (wave)</div>
                  </div>
                </div>

                {/* Mythical */}
                <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-yellow-500/10 rounded-xl p-4 border-2 border-primary/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">5️⃣</span>
                    <h3 className="font-bold text-sm">Mythical</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="font-semibold">Tone:</span> Transcendent, radiant, divine</div>
                    <div><span className="font-semibold">Colors:</span> Celestial pastels, opal rainbow</div>
                    <div><span className="font-semibold">Finish:</span> Multi-layer parallax, particle dust</div>
                    <div><span className="font-semibold">Motion:</span> Multi-directional shimmer + glint rotation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier System */}
            <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
              <h2 className="text-lg font-bold text-foreground mb-4">
                🌊 TIER (Form / Evolution)
              </h2>
              <p className="text-xs text-muted-foreground mb-4">Defines shape, depth, structural detail, and dimensional complexity</p>
              
              <div className="space-y-3">
                {[
                  { level: "1️⃣", name: "Tide", concept: "Flat foundational base", style: "Minimal icon, thin linework", animation: "None" },
                  { level: "2️⃣", name: "Ripple", concept: "Gentle motion", style: "Light depth layering, circular flow", animation: "Subtle wobble animation" },
                  { level: "3️⃣", name: "Wave", concept: "Strength and momentum", style: "Layered highlights, deeper contrast", animation: "Directional motion loop (left/right)" },
                  { level: "4️⃣", name: "Surge", concept: "Complex, empowered", style: "Multiple gradient layers, bold edge highlights", animation: "Multi-axis parallax motion" },
                  { level: "5️⃣", name: "Crest", concept: "Apex form, mastery", style: "Fully dimensional, glowing aura, particle orbit", animation: "Advanced motion blending (parallax + particle)" }
                ].map((tier) => (
                  <div key={tier.name} className="bg-muted/20 rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{tier.level}</span>
                      <h3 className="font-bold text-sm">{tier.name}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <div><span className="font-semibold">Concept:</span> {tier.concept}</div>
                      <div><span className="font-semibold">Style:</span> {tier.style}</div>
                      <div><span className="font-semibold">Animation:</span> {tier.animation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Combined Examples */}
            <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
              <h2 className="text-lg font-bold text-foreground mb-4">
                🧩 Combined Examples (Rarity + Tier)
              </h2>
              
              <div className="space-y-3">
                {[
                  { name: "Drifting Tide", mood: "Soft pastel tones, calm, slightly textured", motion: "Static or minimal bounce when unlocked" },
                  { name: "Flowing Ripple", mood: "Gentle blues, slight shimmer on edges", motion: "Smooth slow shimmer gradient" },
                  { name: "Luminous Wave", mood: "Radiant glow through midtone purples and golds", motion: "Continuous breathing pulse (3s loop)" },
                  { name: "Auroral Surge", mood: "Aurora effect gradients (violet-teal-coral)", motion: "Light sweeps across surface, faint shimmer tail" },
                  { name: "Mythical Crest", mood: "Full parallax glow, rainbow refraction, floating spark particles", motion: "Multi-directional shimmer + subtle orbit motion" }
                ].map((example) => (
                  <div key={example.name} className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/20">
                    <h3 className="font-bold text-sm mb-2">{example.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div><span className="font-semibold">Visual Mood:</span> {example.mood}</div>
                      <div><span className="font-semibold">Motion & Energy:</span> {example.motion}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Moodboard */}
            <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
              <h2 className="text-lg font-bold text-foreground mb-4">
                🎨 Gradient & Light Moodboard
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 font-semibold">Category</th>
                      <th className="text-left py-2 px-3 font-semibold">Base Gradient</th>
                      <th className="text-left py-2 px-3 font-semibold">Highlight Accent</th>
                      <th className="text-left py-2 px-3 font-semibold">Background Glow</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cat: "Drifting", base: "#C6C9D2 → #E9E8F0", highlight: "#FFFFFF", glow: "None" },
                      { cat: "Flowing", base: "#9FD2E0 → #D1F3F9", highlight: "#BCE7F2", glow: "Low blur glow (5%)" },
                      { cat: "Luminous", base: "#D0B3FF → #F8D18E", highlight: "#FFE9B7", glow: "Center glow gradient" },
                      { cat: "Auroral", base: "#7AE9FF → #E3A8FF → #FFC9C9", highlight: "#E8FAF8", glow: "Iridescent hue shift (slow loop)" },
                      { cat: "Mythical", base: "#D8E4FF → #F0C9FF → #FFF3CC", highlight: "#FFFFFF", glow: "Parallax glimmer with particle flicker" }
                    ].map((row) => (
                      <tr key={row.cat} className="border-b border-border/50">
                        <td className="py-2 px-3 font-semibold">{row.cat}</td>
                        <td className="py-2 px-3">{row.base}</td>
                        <td className="py-2 px-3">{row.highlight}</td>
                        <td className="py-2 px-3">{row.glow}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 bg-warning/10 rounded-lg p-3 border border-warning/20 text-xs">
                <p className="font-semibold mb-1">Note:</p>
                <p className="text-muted-foreground">Auroral and Mythical gradients should shimmer dynamically (multi-layer blending or animated gradient mask). Drifting and Flowing stay flat or static.</p>
              </div>
            </div>

            {/* Animation Behavior */}
            <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
              <h2 className="text-lg font-bold text-foreground mb-4">
                💫 Animation Behavior Summary
              </h2>
              
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { type: "Static", desc: "No motion; matte reflection", usage: "Drifting Tide" },
                  { type: "Linear Shimmer", desc: "Horizontal light pass (slow)", usage: "Flowing Ripple" },
                  { type: "Pulse (Breathing)", desc: "Fade-in/out soft inner glow", usage: "Luminous Wave" },
                  { type: "Aurora Sweep", desc: "Slow multicolor gradient wave", usage: "Auroral Surge" },
                  { type: "Parallax Orbit", desc: "Light particles + shimmer rotation", usage: "Mythical Crest" }
                ].map((anim) => (
                  <div key={anim.type} className="bg-muted/20 rounded-xl p-3 border border-border">
                    <h3 className="font-bold text-sm mb-1">{anim.type}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{anim.desc}</p>
                    <p className="text-xs text-primary font-semibold">Usage: {anim.usage}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 bg-accent/10 rounded-lg p-3 border border-accent/20 text-xs">
                <p className="font-semibold mb-1">Complexity Progression:</p>
                <p className="text-muted-foreground">Each rarity level increases motion complexity by one layer: Drifting (0 layers) → Mythical (4+ combined motion layers).</p>
              </div>
            </div>

            {/* Alternate Art Rules */}
            <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
              <h2 className="text-lg font-bold text-foreground mb-4">
                🧿 Alternate Art Rules (Secret Variants)
              </h2>
              
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">Every sticker has a <span className="font-bold text-foreground">1–2% chance</span> of being a secret "Alternate Art" variant.</p>
                
                <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                  <p className="font-semibold mb-2">Visual Markers:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                    <li>Subtle star halo behind sticker</li>
                    <li>Unique colorway (inverted palette or seasonal tone)</li>
                    <li>Small Ottr pawprint watermark for authentication</li>
                  </ul>
                </div>
                
                <div className="bg-accent/10 rounded-lg p-3 border border-accent/20 text-xs">
                  <p className="font-semibold">Note:</p>
                  <p className="text-muted-foreground mt-1">These variants are purely aesthetic, not functional — a flex moment.</p>
                </div>
              </div>
            </div>

            {/* Design Integration */}
            <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-3xl p-6 border-2 border-success/30">
              <h3 className="text-base font-bold text-foreground mb-3">
                🧰 Design Integration Notes
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground text-xs mb-1">Vector/SVG Ready:</p>
                  <p className="text-xs">Keep all elements vector or SVG-ready for scaling.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-xs mb-1">CSS Variable Naming:</p>
                  <div className="bg-card rounded-lg p-2 mt-1 font-mono text-xs">
                    <div>--sticker-motion-level: 0–5</div>
                    <div>--sticker-light-gradient: rarity-based</div>
                    <div>--sticker-depth-tier: tier-based</div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-xs mb-1">Motion Speed:</p>
                  <p className="text-xs">3–5s loops max (nothing fast or flashing)</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-xs mb-1">Accessibility:</p>
                  <p className="text-xs">Avoid harsh contrasts; maintain calming gradients</p>
                </div>
              </div>
            </div>

            {/* Summary Hierarchy */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-6 border-2 border-primary/30">
              <h3 className="text-base font-bold text-foreground mb-3">
                💬 Summary Hierarchy
              </h3>
              <div className="space-y-2 text-sm">
                <div className="bg-card rounded-lg p-3 border border-border">
                  <p className="font-semibold text-xs mb-1">RARITY → defines energy (light / emotion)</p>
                </div>
                <div className="bg-card rounded-lg p-3 border border-border">
                  <p className="font-semibold text-xs mb-1">TIER → defines form (depth / complexity)</p>
                </div>
              </div>
              
              <div className="mt-4 bg-muted/50 rounded-lg p-4 text-xs space-y-1 font-mono">
                <p className="text-muted-foreground">"Drifting Tide" → Simple pastel matte base</p>
                <p className="text-muted-foreground">"Flowing Ripple" → Light shimmer gradient</p>
                <p className="text-muted-foreground">"Luminous Wave" → Balanced glow pulse</p>
                <p className="text-muted-foreground">"Auroral Surge" → Iridescent multi-layer motion</p>
                <p className="text-muted-foreground">"Mythical Crest" → Full animated parallax with aura particles</p>
              </div>
            </div>
          </>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default StateFlowDiagram;
