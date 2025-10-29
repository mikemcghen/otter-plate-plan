import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/Confetti";
import { OtterMascot } from "@/components/OtterMascot";
import { Sparkles } from "lucide-react";

interface BadgeUnlockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badgeName: string;
  badgeDescription: string;
}

export const BadgeUnlockModal = ({
  open,
  onOpenChange,
  badgeName,
  badgeDescription,
}: BadgeUnlockModalProps) => {
  return (
    <>
      <Confetti active={open} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm rounded-3xl border-2 border-primary p-8 bg-gradient-to-b from-card to-primary/5">
          <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
            <OtterMascot mood="joyful" animate={true} />

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                <h2 className="text-2xl font-bold text-primary">Badge Unlocked!</h2>
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {badgeName}
              </h3>
              <p className="text-base text-muted-foreground">
                {badgeDescription}
              </p>
            </div>

            <Button
              size="lg"
              className="w-full h-12 rounded-2xl active:scale-95 transition-transform"
              onClick={() => onOpenChange(false)}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Awesome!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
