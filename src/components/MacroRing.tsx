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
        {/* Soft outer glow layer - additive blending effect */}
        {percentage > 30 && (
          <div 
            className="absolute inset-0 rounded-full transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${color}40 0%, ${color}20 40%, transparent 70%)`,
              transform: `scale(${1.15 + (percentage / 100) * 0.15})`,
              filter: 'blur(8px)',
              mixBlendMode: 'screen',
              opacity: percentage / 100,
            }}
          />
        )}
        
        <svg width={size} height={size} className="transform -rotate-90 relative z-10">
          <defs>
            {/* Radial gradient for progress ring */}
            <radialGradient id={`ring-gradient-${label}`} cx="50%" cy="30%">
              <stop offset="0%" stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.7" />
            </radialGradient>
            
            {/* Shimmer gradient for subtle inner reflection */}
            <linearGradient id={`shimmer-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
            </linearGradient>
          </defs>
          
          {/* Background ring - darker for high contrast */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={strokeWidth}
            fill="none"
            opacity="0.6"
          />
          
          {/* Progress ring with radial gradient fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#ring-gradient-${label})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
          
          {/* Shimmer overlay on progress ring */}
          {percentage > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={`url(#shimmer-${label})`}
              strokeWidth={strokeWidth - 1}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
              opacity="0.6"
            />
          )}
          
          {/* Specular highlight - small white dot offset 30° from top */}
          {percentage > 20 && (
            <circle
              cx={size / 2 + radius * Math.sin(Math.PI / 6) * 0.8}
              cy={size / 2 - radius * Math.cos(Math.PI / 6) * 0.8}
              r={2}
              fill="rgba(255,255,255,0.9)"
              className="transition-opacity duration-500"
              opacity={Math.min(percentage / 100, 0.9)}
            />
          )}
          
          {/* Soft pulse ring when complete - emits light */}
          {percentage >= 100 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius + 3}
              stroke={color}
              strokeWidth={1.5}
              fill="none"
              opacity="0.5"
              className="animate-pulse"
              style={{ filter: 'blur(1px)' }}
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
          <div 
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
            style={{
              background: color,
              boxShadow: `0 0 8px ${color}80`,
            }}
          />
        )}
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
};
