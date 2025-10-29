interface MacroRingProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
}

export const MacroRing = ({
  label,
  current,
  target,
  color,
  unit = "g",
}: MacroRingProps) => {
  const percentage = Math.min((current / target) * 100, 100);
  const size = 80;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className="relative transition-transform duration-200 group-hover:scale-105">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            fill="none"
            opacity="0.4"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
            style={{
              filter: percentage > 90 ? "drop-shadow(0 0 4px currentColor)" : "none"
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-foreground transition-all duration-300">
            {current}
          </span>
          <span className="text-xs text-muted-foreground">/{target}{unit}</span>
        </div>
        {/* Completion celebration */}
        {percentage >= 100 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-bounce-subtle" />
        )}
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
};
