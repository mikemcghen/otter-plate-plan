import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

interface Snack {
  name: string;
  calories: number;
  protein: number;
  emoji: string;
}

interface SnackCarouselProps {
  snacks: Snack[];
  onLog: (snack: Snack) => void;
  otterImage: string;
}

export const SnackCarousel = ({ snacks, onLog, otterImage }: SnackCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-2">
        <img
          src={otterImage}
          alt="Otter mascot"
          className="w-16 h-16 object-contain animate-bounce-subtle"
        />
        <div>
          <h3 className="text-base font-bold text-foreground">Snack Time! 🦦</h3>
          <p className="text-sm text-muted-foreground">Swipe for options</p>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {snacks.map((snack, index) => (
            <div
              key={index}
              className="flex-[0_0_85%] min-w-0 bg-card rounded-2xl p-4 border-2 border-border shadow-[0_4px_20px_rgb(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.3)] transition-all duration-300"
              style={{
                opacity: selectedIndex === index ? 1 : 0.6,
                transform: selectedIndex === index ? "scale(1)" : "scale(0.95)",
              }}
            >
              <div className="space-y-3">
                <div className="bg-secondary/50 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{snack.emoji}</span>
                    <p className="font-semibold text-foreground">{snack.name}</p>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{snack.calories} cal</span>
                    <span>{snack.protein}g protein</span>
                  </div>
                </div>
                <Button
                  onClick={() => onLog(snack)}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log this snack
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2">
        {snacks.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              selectedIndex === index
                ? "w-6 bg-primary"
                : "w-2 bg-border hover:bg-primary/50"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};
