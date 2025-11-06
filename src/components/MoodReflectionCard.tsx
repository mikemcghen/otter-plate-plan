import { useState } from "react";
import { Sparkles } from "lucide-react";

interface MoodReflectionCardProps {
  onSave?: (reflection: string) => void;
}

const reflectionPrompts = [
  "What energized you today?",
  "One thing that made you smile?",
  "What are you grateful for?",
  "What did you learn about yourself?",
];

export const MoodReflectionCard = ({ onSave }: MoodReflectionCardProps) => {
  const [reflection, setReflection] = useState("");
  const [prompt] = useState(reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)]);

  const handleSave = () => {
    if (reflection.trim()) {
      onSave?.(reflection);
      setReflection("");
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-background/80 to-muted/40 rounded-3xl p-6 backdrop-blur-md border border-border/30 shadow-lg">
      {/* Ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-3xl blur-xl -z-10 animate-breathing" />
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="text-lg font-semibold text-foreground">Pause for a moment...</h3>
        </div>
        
        <p className="text-sm text-muted-foreground italic">{prompt}</p>
        
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Type your thoughts here..."
          className="w-full min-h-[100px] bg-background/50 border border-border rounded-2xl p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all"
        />
        
        <button
          onClick={handleSave}
          disabled={!reflection.trim()}
          className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium py-3 rounded-full hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Save Reflection
        </button>
      </div>
    </div>
  );
};
