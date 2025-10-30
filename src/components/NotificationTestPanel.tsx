import { Bell, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

type NotificationTestPanelProps = {
  onTriggerDailyGreeting: () => void;
  onTriggerEndOfDay: () => void;
  onTriggerLevelUp: () => void;
  onTriggerBadgeUnlock: () => void;
  onTriggerAchievement: () => void;
  onTriggerSnackPicker: () => void;
  onTriggerSuccessModal: () => void;
  onTriggerNotificationBanner: () => void;
};

export const NotificationTestPanel = ({
  onTriggerDailyGreeting,
  onTriggerEndOfDay,
  onTriggerLevelUp,
  onTriggerBadgeUnlock,
  onTriggerAchievement,
  onTriggerSnackPicker,
  onTriggerSuccessModal,
  onTriggerNotificationBanner,
}: NotificationTestPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    { label: "Daily Greeting Modal", action: onTriggerDailyGreeting },
    { label: "End of Day Summary", action: onTriggerEndOfDay },
    { label: "Level Up Modal", action: onTriggerLevelUp },
    { label: "Badge Unlock Modal", action: onTriggerBadgeUnlock },
    { label: "Achievement Capsule", action: onTriggerAchievement },
    { label: "Snack Picker Modal", action: onTriggerSnackPicker },
    { label: "Success Confirmation", action: onTriggerSuccessModal },
    { label: "Notification Banner", action: onTriggerNotificationBanner },
  ];

  return (
    <>
      {/* Trigger Button */}
      <Button
        size="icon"
        variant="ghost"
        className="w-10 h-10 rounded-full relative active:scale-95 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
          {notifications.length}
        </span>
      </Button>

      {/* Sliding Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-[100] animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-card border-l border-border z-[101] animate-slide-in-right shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Test Notifications
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Trigger modals manually
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Notification List */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  {notifications.map((notification, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        notification.action();
                        setIsOpen(false);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-border hover:border-primary/50 active:scale-[0.98]"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {notification.label}
                      </p>
                    </button>
                  ))}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">
                  💡 These are test triggers for development
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
