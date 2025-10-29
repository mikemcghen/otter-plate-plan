import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OtterMascot } from "@/components/OtterMascot";
import { Sparkles, Trophy } from "lucide-react";
import { useHaptics } from "@/hooks/useHaptics";
import { Confetti } from "@/components/Confetti";

interface LevelUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: number;
}

export const LevelUpModal = ({ open, onOpenChange, level }: LevelUpModalProps) => {
  const { notification } = useHaptics();

  const handleContinue = async () => {
    await notification("success");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Confetti active={open} />
      <DialogContent className="max-w-sm rounded-3xl border-2 border-primary p-8 bg-gradient-to-b from-card to-primary/5">
        <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
          <div className="relative">
            <OtterMascot mood="joyful" animate={true} />
            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center animate-bounce-subtle">
              <Trophy className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              <h2 className="text-3xl font-bold text-primary">Level Up!</h2>
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <p className="text-xl font-bold text-foreground">
              You reached Level {level}!
            </p>
            <p className="text-base text-muted-foreground">
              Ottr is proud of you 💜
            </p>
          </div>

          <div className="bg-primary/10 rounded-2xl p-6 w-full border-2 border-primary/20">
            <p className="text-sm font-medium text-foreground">
              Consistency is the key to success. Keep logging your meals and watch your progress grow!
            </p>
          </div>

          <Button
            size="lg"
            className="w-full h-12 rounded-2xl active:scale-95 transition-transform"
            onClick={handleContinue}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
