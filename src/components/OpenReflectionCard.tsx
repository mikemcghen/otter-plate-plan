import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface OpenReflectionCardProps {
  onComplete: (data: string) => void;
  data?: string;
  reflectionData: any;
}

const prompts = [
  "What energized you today?",
  "One thing that made you smile?",
  "What are you grateful for?",
  "What did you learn about yourself?",
];

export const OpenReflectionCard = ({ onComplete, data, reflectionData }: OpenReflectionCardProps) => {
  const [reflection, setReflection] = useState(data || "");
  const [prompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);

  const handleComplete = () => {
    if (reflection.trim()) {
      onComplete(reflection);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Decorative ambient */}
      <div className="flex justify-center mb-2">
        <Sparkles className="w-8 h-8 text-primary/40 animate-pulse" strokeWidth={1.5} />
      </div>

      <h2 className="text-xl font-semibold text-center text-foreground tracking-tight">
        One last reflection...
      </h2>

      <div className="space-y-6">
        <p className="text-sm text-muted-foreground italic text-center leading-relaxed">
          🦦 <span className="font-medium">"{prompt}"</span>
        </p>

        <Textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Type your thoughts here..."
          className="min-h-[120px] bg-background/50 border-border/50 rounded-2xl p-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 resize-none shadow-inner"
        />

        <Button
          onClick={handleComplete}
          disabled={!reflection.trim()}
          className="w-full py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-accent to-primary hover:shadow-lg transition-all disabled:opacity-50"
        >
          Complete
        </Button>
      </div>
    </div>
  );
};
