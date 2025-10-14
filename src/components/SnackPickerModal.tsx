import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SnackCarousel } from "@/components/SnackCarousel";

interface Snack {
  name: string;
  calories: number;
  protein: number;
  emoji: string;
}

interface SnackPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snacks: Snack[];
  onLog: (snack: Snack) => void;
  otterImage: string;
}

export const SnackPickerModal = ({
  open,
  onOpenChange,
  snacks,
  onLog,
  otterImage,
}: SnackPickerModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-md rounded-3xl border-2 border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Choose Your Snack
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <SnackCarousel
            snacks={snacks}
            onLog={(snack) => {
              onLog(snack);
              onOpenChange(false);
            }}
            otterImage={otterImage}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
