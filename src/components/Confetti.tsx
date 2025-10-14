import { useEffect, useState } from "react";

interface ConfettiProps {
  active: boolean;
}

export const Confetti = ({ active }: ConfettiProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-primary rounded-full animate-[fall_2s_ease-in_forwards]"
          style={{
            left: `${particle.x}%`,
            top: "-10px",
            animationDelay: `${particle.delay}s`,
            backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
          }}
        />
      ))}
    </div>
  );
};
