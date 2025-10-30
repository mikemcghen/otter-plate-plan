import { useState } from "react";
import { CheckCircle2, Circle, Droplets, Heart, MessageCircle, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OtterMascot } from "./OtterMascot";
import { useHaptics } from "@/hooks/useHaptics";

interface Quest {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  polaroid?: string;
}

export const OttrJournal = () => {
  const { notification } = useHaptics();
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: "hydration",
      title: "Hydration Hero",
      description: "Log 8 glasses of water today",
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      completed: false,
    },
    {
      id: "nutrition",
      title: "Balanced Bites",
      description: "Hit your macro targets",
      icon: <UtensilsCrossed className="w-5 h-5 text-green-400" />,
      completed: false,
    },
    {
      id: "reflection",
      title: "Check-In Time",
      description: "Share how you're feeling",
      icon: <Heart className="w-5 h-5 text-pink-400" />,
      completed: false,
    },
    {
      id: "social",
      title: "Friendly Wave",
      description: "Send encouragement to a friend",
      icon: <MessageCircle className="w-5 h-5 text-purple-400" />,
      completed: false,
    },
  ]);

  const handleCompleteQuest = async (questId: string) => {
    await notification("success");
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId ? { ...q, completed: true, polaroid: `✨ ${q.title}` } : q
      )
    );
  };

  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-2 border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">🦦 Ottr's Journal</h3>
        <span className="text-sm text-muted-foreground">
          {completedCount}/4 complete
        </span>
      </div>

      {completedCount === 4 && (
        <div className="mb-4 animate-fade-in">
          <OtterMascot mood="proud" message="You completed today's quests!" animate={true} />
        </div>
      )}

      <div className="space-y-3">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={`group relative transition-all duration-[1500ms] ${
              quest.completed
                ? "opacity-80 scale-[0.98] hover:scale-100"
                : "hover:scale-[1.02]"
            }`}
          >
            {quest.completed ? (
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-4 border-2 border-primary/20 shadow-[0_4px_20px_rgba(147,51,234,0.1)] transform rotate-[-0.5deg] transition-transform duration-[2000ms]">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{quest.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground line-through opacity-60">
                        {quest.title}
                      </p>
                      <CheckCircle2 className="w-5 h-5 text-success animate-breathing" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{quest.polaroid}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card/50 rounded-2xl p-4 border-2 border-border hover:border-primary/30 transition-all duration-500">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{quest.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{quest.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{quest.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="shrink-0 active:scale-95 transition-transform"
                    onClick={() => handleCompleteQuest(quest.id)}
                  >
                    <Circle className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
