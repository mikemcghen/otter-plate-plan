import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

interface MovementGustsProps {
  current: number;
  goal: number;
}

export const MovementGusts = ({ current, goal }: MovementGustsProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; delay: number; duration: number; left: number }>>([]);
  const percentage = Math.min((current / goal) * 100, 100);
  const particleCount = Math.floor(percentage / 20);

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      left: Math.random() * 100,
    }));
    setParticles(newParticles);
  }, [particleCount]);

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          <span className="text-sm font-semibold text-foreground">Movement Gusts</span>
        </div>
        <span className="text-sm text-muted-foreground">{current}/{goal} min</span>
      </div>
      
      <div className="relative h-20 bg-muted/20 rounded-2xl overflow-hidden backdrop-blur-sm border border-border/40">
        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1.5 h-1.5 bg-accent/60 rounded-full animate-[drift_var(--duration)_ease-in-out_infinite]"
            style={{
              left: `${particle.left}%`,
              bottom: "10%",
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              "--duration": `${particle.duration}s`,
            } as React.CSSProperties}
          />
        ))}
        
        {/* Progress indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{Math.round(percentage)}%</p>
            <p className="text-xs text-muted-foreground">of goal met</p>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-2 italic">
        {percentage >= 100 ? "The wind is strong with you! 💨" : percentage >= 50 ? "Gusts picking up momentum" : "Movement creates energy"}
      </p>
    </div>
  );
};
