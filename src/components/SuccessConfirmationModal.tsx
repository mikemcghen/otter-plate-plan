import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/Confetti";
import { PartyPopper, Sparkles } from "lucide-react";
import otterDancing from "@/assets/otter-dancing.png";

interface SuccessConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snackName: string;
}

export const SuccessConfirmationModal = ({
  open,
  onOpenChange,
  snackName,
}: SuccessConfirmationModalProps) => {
  return (
    <>
      <Confetti active={open} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[90vw] sm:max-w-md rounded-3xl border-2 border-success/20 bg-gradient-to-br from-success/5 to-success/10">
          <div className="flex flex-col items-center gap-6 py-6">
            <img
              src={otterDancing}
              alt="Dancing otter"
              className="w-32 h-32 object-contain"
            />
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <PartyPopper className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">
                  Awesome!
                </h3>
              </div>
              <p className="text-base text-muted-foreground">
                {snackName} logged successfully!
              </p>
              <div className="flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-success" />
                <p className="text-sm text-success font-medium">
                  +10 XP for healthy snacking
                </p>
              </div>
            </div>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-gradient-to-r from-success to-success/80 hover:opacity-90 transition-opacity"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
