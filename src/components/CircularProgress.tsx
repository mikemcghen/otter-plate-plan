import { cn } from "@/lib/utils";

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  value?: string;
  status?: "success" | "warning" | "normal";
  showGlow?: boolean;
}

export const CircularProgress = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  label,
  value,
  status = "normal",
  showGlow = false,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const strokeColor =
    status === "success"
      ? "hsl(var(--success))"
      : status === "warning"
      ? "hsl(var(--streak))"
      : "hsl(var(--primary))";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-all duration-500 ease-out",
            showGlow && "drop-shadow-[0_0_8px_var(--primary)]"
          )}
          style={{
            filter: showGlow ? `drop-shadow(0 0 8px ${strokeColor})` : undefined,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {value && <div className="text-2xl font-bold text-foreground">{value}</div>}
        {label && <div className="text-xs text-muted-foreground mt-1">{label}</div>}
      </div>
    </div>
  );
};
