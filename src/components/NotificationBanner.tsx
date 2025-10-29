import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import otterHappy from "@/assets/otter-happy.png";

interface NotificationBannerProps {
  message: string;
  onOpen: () => void;
  onDismiss: () => void;
  visible: boolean;
}

export const NotificationBanner = ({
  message,
  onOpen,
  onDismiss,
  visible,
}: NotificationBannerProps) => {
  if (!visible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-[slideDown_0.3s_ease-out] md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-card rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4">
          <div className="flex items-start gap-3">
            <img
              src={otterHappy}
              alt="Otter notification"
              className="w-12 h-12 object-contain"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-primary mb-1">
                    OttrCal 🦦
                  </p>
                  <p className="text-sm text-foreground font-medium">
                    {message}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full -mt-1"
                  onClick={onDismiss}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={onOpen}
                size="sm"
                className="mt-3 w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity h-8 text-xs"
              >
                View Snack Options
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
