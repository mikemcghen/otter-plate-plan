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
      <div className="relative transition-transform duration-300 group-hover:scale-110">
        {/* Outer glow ring for reactive effect */}
        {percentage > 50 && (
          <div 
            className="absolute inset-0 rounded-full transition-all duration-700"
            style={{
              background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
              transform: `scale(${1 + (percentage / 100) * 0.2})`,
            }}
          />
        )}
        
        <svg width={size} height={size} className="transform -rotate-90 relative z-10">
          {/* Background ring - darker for contrast */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={strokeWidth}
            fill="none"
            opacity="0.5"
          />
          {/* Progress ring with enhanced glow */}
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
              filter: percentage > 75 
                ? `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 12px ${color}50)` 
                : percentage > 50 
                ? `drop-shadow(0 0 3px ${color})` 
                : "none"
            }}
          />
          {/* Pulse animation ring when complete */}
          {percentage >= 100 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius + 2}
              stroke={color}
              strokeWidth={2}
              fill="none"
              opacity="0.4"
              className="animate-pulse"
            />
          )}
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-sm font-bold text-foreground transition-all duration-300">
            {current}
          </span>
          <span className="text-xs text-muted-foreground">/{target}{unit}</span>
        </div>
        
        {/* Completion celebration sparkle */}
        {percentage >= 100 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse shadow-lg shadow-success/50" />
        )}
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
};
