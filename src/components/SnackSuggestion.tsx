import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import otterHappy from "@/assets/otter-happy.png";

interface SnackSuggestionProps {
  snackName: string;
  calories: number;
  protein: number;
  onLog: () => void;
}

export const SnackSuggestion = ({
  snackName,
  calories,
  protein,
  onLog,
}: SnackSuggestionProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-lg animate-scale-in">
      <div className="flex items-start gap-4">
        <img
          src={otterHappy}
          alt="Otter mascot"
          className="w-20 h-20 object-contain animate-bounce-subtle"
        />
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">Snack Time! 🦦</h3>
            <p className="text-sm text-muted-foreground">
              How about a healthy snack?
            </p>
          </div>
          <div className="bg-secondary/50 rounded-xl p-3 space-y-1">
            <p className="font-semibold text-foreground">{snackName}</p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{calories} cal</span>
              <span>{protein}g protein</span>
            </div>
          </div>
          <Button
            onClick={onLog}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log this snack
          </Button>
        </div>
      </div>
    </div>
  );
};
