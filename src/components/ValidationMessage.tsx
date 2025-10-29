import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationMessageProps {
  type: "error" | "success" | "info";
  message: string;
  className?: string;
}

export const ValidationMessage = ({ type, message, className }: ValidationMessageProps) => {
  const icons = {
    error: <AlertCircle className="w-4 h-4" />,
    success: <CheckCircle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
  };

  const colors = {
    error: "text-destructive bg-destructive/10",
    success: "text-success bg-success/10",
    info: "text-primary bg-primary/10",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium animate-fade-in",
        colors[type],
        className
      )}
    >
      {icons[type]}
      <span>{message}</span>
    </div>
  );
};
