import { useState } from "react";
import { ReflectionCardBase } from "./ReflectionCardBase";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Cloud } from "lucide-react";

interface OpenReflectionCardProps {
  onComplete: () => void;
  isCompleted: boolean;
}

const prompts = [
  "What energized you today?",
  "One thing that made you smile?",
  "What are you grateful for?",
  "What did you learn about yourself?",
];

export const OpenReflectionCard = ({ onComplete, isCompleted }: OpenReflectionCardProps) => {
  const [reflection, setReflection] = useState("");
  const [prompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);

  const handleComplete = () => {
    if (reflection.trim()) {
      onComplete();
    }
  };

  const decorativeScene = (
    <div className="absolute inset-0 flex items-center justify-center">
      <Cloud className="w-24 h-24 text-accent/30 animate-float" />
      <Sparkles className="absolute top-12 right-16 w-8 h-8 text-primary/40 animate-twinkle" />
      <Sparkles className="absolute bottom-16 left-12 w-6 h-6 text-primary/40 animate-twinkle delay-400" />
    </div>
  );

  return (
    <ReflectionCardBase
      decorativeScene={decorativeScene}
      promptText="One last reflection..."
      gradientFrom="--accent"
      gradientTo="--secondary"
    >
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground italic text-center">
          🦦 <span className="font-medium">"{prompt}"</span>
        </p>

        <Textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Type your thoughts here..."
          className="min-h-[140px] bg-background/50 border-border/50 rounded-2xl p-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 resize-none shadow-inner"
          disabled={isCompleted}
        />

        <Button
          onClick={handleComplete}
          disabled={!reflection.trim() || isCompleted}
          className="w-full py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-accent to-primary hover:shadow-lg transition-all"
        >
          {isCompleted ? "✓ Recorded" : "Complete"}
        </Button>
      </div>
    </ReflectionCardBase>
  );
};
