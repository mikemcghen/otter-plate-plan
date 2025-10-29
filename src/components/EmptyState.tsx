import { Button } from "@/components/ui/button";
import { AlertTriangle, WifiOff } from "lucide-react";
import { ReactNode } from "react";
import otterHappy from "@/assets/otter-happy.png";
import otterEncourage from "@/assets/otter-encourage.png";
import otterConcerned from "@/assets/otter-concerned.png";
import otterSleepy from "@/assets/otter-sleepy.png";

type OtterVariant = "happy" | "encourage" | "concerned" | "sleepy";

interface EmptyStateProps {
  variant?: OtterVariant;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
  className?: string;
}

const otterImages = {
  happy: otterHappy,
  encourage: otterEncourage,
  concerned: otterConcerned,
  sleepy: otterSleepy,
};

export const EmptyState = ({
  variant = "encourage",
  title,
  description,
  action,
  icon,
  className = "",
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      {/* Otter Illustration */}
      <div className="relative mb-6">
        <img
          src={otterImages[variant]}
          alt="Ottr mascot"
          className="w-24 h-24 object-contain animate-fade-in"
        />
        <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full blur-xl -z-10" />
      </div>

      {/* Icon (optional) */}
      {icon && (
        <div className="mb-4 text-muted-foreground opacity-50">
          {icon}
        </div>
      )}

      {/* Text Content */}
      <h3 className="text-lg font-bold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <Button
          onClick={action.onClick}
          className="rounded-2xl h-12 px-6 active:scale-95 transition-transform"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Error State Variant
interface ErrorStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const ErrorState = ({
  title,
  description,
  action,
  className = "",
}: ErrorStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      {/* Concerned Otter */}
      <div className="relative mb-6">
        <img
          src={otterConcerned}
          alt="Concerned Ottr"
          className="w-24 h-24 object-contain animate-fade-in"
        />
        <div className="absolute inset-0 bg-warning/10 dark:bg-warning/20 rounded-full blur-xl -z-10" />
      </div>

      {/* Error Icon */}
      <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-warning" />
      </div>

      {/* Text Content */}
      <h3 className="text-lg font-bold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <Button
          onClick={action.onClick}
          variant="outline"
          className="rounded-2xl h-12 px-6 border-2 active:scale-95 transition-transform"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Offline State Variant
export const OfflineState = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      {/* Sleepy Otter */}
      <div className="relative mb-6">
        <img
          src={otterSleepy}
          alt="Sleepy Ottr"
          className="w-24 h-24 object-contain animate-fade-in"
        />
        <div className="absolute inset-0 bg-muted/20 rounded-full blur-xl -z-10" />
      </div>

      {/* Offline Icon */}
      <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mb-4">
        <WifiOff className="w-6 h-6 text-muted-foreground" />
      </div>

      {/* Text Content */}
      <h3 className="text-lg font-bold text-foreground mb-2">
        You're Offline
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Ottr can't reach the water right now. Check your connection and try again!
      </p>

      {/* Retry Button */}
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="rounded-2xl h-12 px-6 border-2 active:scale-95 transition-transform"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
