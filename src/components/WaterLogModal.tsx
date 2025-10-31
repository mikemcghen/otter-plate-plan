import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Droplet, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WaterLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentWater: number;
  targetWater: number;
  onLogWater: (amount: number) => void;
  onUndoWater: () => void;
}

export const WaterLogModal = ({
  open,
  onOpenChange,
  currentWater,
  targetWater,
  onLogWater,
  onUndoWater,
}: WaterLogModalProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const quickAmounts = [
    { label: "1 cup", ml: 250, icon: "🥤" },
    { label: "1 bottle", ml: 500, icon: "💧" },
    { label: "1 liter", ml: 1000, icon: "🚰" },
  ];

  const handleLog = (ml: number) => {
    setSelectedAmount(ml);
    onLogWater(ml);
    setTimeout(() => {
      setSelectedAmount(null);
      onOpenChange(false);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Droplet className="w-5 h-5" />
            Log Water
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current progress */}
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-foreground">
              {currentWater} <span className="text-lg text-muted-foreground">/ {targetWater} ml</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {Math.round((currentWater / targetWater) * 100)}% of daily goal
            </div>
          </div>

          {/* Quick log buttons */}
          <div className="grid grid-cols-3 gap-3">
            {quickAmounts.map((amount) => (
              <Button
                key={amount.ml}
                variant="outline"
                className={cn(
                  "h-24 flex flex-col gap-2 transition-all duration-300",
                  selectedAmount === amount.ml && "bg-primary/10 border-primary scale-95"
                )}
                onClick={() => handleLog(amount.ml)}
              >
                <span className="text-2xl">{amount.icon}</span>
                <span className="text-xs font-medium">{amount.label}</span>
                <span className="text-xs text-muted-foreground">{amount.ml}ml</span>
              </Button>
            ))}
          </div>

          {/* Undo button */}
          {currentWater > 0 && (
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={() => {
                onUndoWater();
                onOpenChange(false);
              }}
            >
              <Undo2 className="w-4 h-4 mr-2" />
              Undo Last Log
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
