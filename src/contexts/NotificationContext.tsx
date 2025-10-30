import { createContext, useContext, useState, ReactNode } from "react";

type NotificationContextType = {
  triggerDailyGreeting: () => void;
  triggerEndOfDay: () => void;
  triggerLevelUp: () => void;
  triggerBadgeUnlock: () => void;
  triggerAchievement: () => void;
  triggerSnackPicker: () => void;
  triggerSuccessModal: () => void;
  triggerNotificationBanner: () => void;
  triggerQuickLog: () => void;
  registerHandlers: (handlers: Partial<NotificationHandlers>) => void;
};

type NotificationHandlers = {
  onDailyGreeting: () => void;
  onEndOfDay: () => void;
  onLevelUp: () => void;
  onBadgeUnlock: () => void;
  onAchievement: () => void;
  onSnackPicker: () => void;
  onSuccessModal: () => void;
  onNotificationBanner: () => void;
  onQuickLog: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [handlers, setHandlers] = useState<Partial<NotificationHandlers>>({});

  const registerHandlers = (newHandlers: Partial<NotificationHandlers>) => {
    setHandlers(prev => ({ ...prev, ...newHandlers }));
  };

  const triggerDailyGreeting = () => handlers.onDailyGreeting?.();
  const triggerEndOfDay = () => handlers.onEndOfDay?.();
  const triggerLevelUp = () => handlers.onLevelUp?.();
  const triggerBadgeUnlock = () => handlers.onBadgeUnlock?.();
  const triggerAchievement = () => handlers.onAchievement?.();
  const triggerSnackPicker = () => handlers.onSnackPicker?.();
  const triggerSuccessModal = () => handlers.onSuccessModal?.();
  const triggerNotificationBanner = () => handlers.onNotificationBanner?.();
  const triggerQuickLog = () => handlers.onQuickLog?.();

  return (
    <NotificationContext.Provider
      value={{
        triggerDailyGreeting,
        triggerEndOfDay,
        triggerLevelUp,
        triggerBadgeUnlock,
        triggerAchievement,
        triggerSnackPicker,
        triggerSuccessModal,
        triggerNotificationBanner,
        triggerQuickLog,
        registerHandlers,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};
