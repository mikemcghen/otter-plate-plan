interface AmbientParticleProps {
  delay?: number;
  size?: number;
  left?: string;
}

export const AmbientParticle = ({ delay = 0, size = 8, left = "50%" }: AmbientParticleProps) => {
  return (
    <div
      className="absolute bottom-0 rounded-full bg-white/20 animate-[drift_4s_ease-in-out_infinite]"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left,
        animationDelay: `${delay}s`,
      }}
    />
  );
};
