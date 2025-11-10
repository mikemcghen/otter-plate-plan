import { useState } from "react";
import { Button } from "@/components/ui/button";

interface HydrationReflectionCardProps {
  onComplete: (data: number) => void;
  data?: number;
}

export const HydrationReflectionCard = ({ onComplete, data }: HydrationReflectionCardProps) => {
  const [cups, setCups] = useState<number>(data || 0);

  const handleComplete = () => {
    if (cups > 0) {
      onComplete(cups);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center text-foreground">
        How many cups of water today?
      </h2>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl font-bold text-foreground">{cups}</div>
            <p className="text-sm text-muted-foreground mt-2">cups (8 oz each)</p>
          </div>
          
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => setCups(Math.max(0, cups - 1))}
              variant="outline"
              size="lg"
              className="text-2xl w-14 h-14 rounded-full"
              disabled={cups === 0}
            >
              -
            </Button>
            <Button
              onClick={() => setCups(Math.min(20, cups + 1))}
              variant="outline"
              size="lg"
              className="text-2xl w-14 h-14 rounded-full"
            >
              +
            </Button>
          </div>

          <div className="flex justify-center gap-2 flex-wrap max-w-xs mx-auto">
            {[2, 4, 6, 8, 10].map((preset) => (
              <Button
                key={preset}
                onClick={() => setCups(preset)}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                {preset} cups
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleComplete}
          disabled={cups === 0}
          className="w-full py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
