import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OtterMascot } from "@/components/OtterMascot";
import { TrendingUp, UtensilsCrossed, Sparkles, Share2, PartyPopper, Moon, Heart } from "lucide-react";
import { useHaptics } from "@/hooks/useHaptics";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface EndOfDaySummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  xpGained: number;
  foodsLogged: number;
  isPerfect: boolean;
}

export const EndOfDaySummaryModal = ({
  open,
  onOpenChange,
  xpGained,
  foodsLogged,
  isPerfect,
}: EndOfDaySummaryModalProps) => {
  const { impact, notification } = useHaptics();
  const navigate = useNavigate();

  const getOtterComment = () => {
    if (isPerfect) return { text: "Perfect day! You crushed it!", icon: PartyPopper };
    if (foodsLogged >= 3) return { text: "Great tracking today! Ottr is proud!", icon: Sparkles };
    if (foodsLogged > 0) return { text: "Nice work today! Rest and refuel tomorrow.", icon: Moon };
    return { text: "Tomorrow is a new day. Ottr believes in you!", icon: Heart };
  };

  const handleShare = async () => {
    await impact();
    toast({
      title: "Share coming soon!",
      description: "We're working on sharing your streak",
    });
  };

  const otterComment = getOtterComment();

  const handleViewTrends = async () => {
    await impact();
    onOpenChange(false);
    navigate("/trends");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl border-2 border-border p-8">
        <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
          <OtterMascot
            mood={isPerfect ? "joyful" : foodsLogged >= 3 ? "proud" : "happy"}
            animate={true}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">
                Day Complete!
              </h2>
              <Moon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <otterComment.icon className="w-4 h-4 text-primary" />
              <p className="text-base text-muted-foreground">
                {otterComment.text}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="w-full space-y-3">
            {/* XP Gained */}
            <div className="bg-primary/10 rounded-2xl p-4 border-2 border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-foreground">
                    XP Gained
                  </span>
                </div>
                <span className="text-xl font-bold text-primary">
                  +{xpGained}
                </span>
              </div>
              <Progress value={(xpGained / 100) * 100} className="h-2" />
            </div>

            {/* Foods Logged */}
            <div className="bg-accent/10 rounded-2xl p-4 border-2 border-accent/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-accent" />
                  <span className="text-sm font-bold text-foreground">
                    Foods Logged
                  </span>
                </div>
                <span className="text-xl font-bold text-accent">
                  {foodsLogged}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2">
            <Button
              variant="outline"
              className="w-full h-12 rounded-2xl border-2 active:scale-95 transition-transform"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Streak
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 rounded-2xl border-2 active:scale-95 transition-transform"
              onClick={handleViewTrends}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              See Trends
            </Button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
