import { ReactNode } from "react";

interface ReflectionCardBaseProps {
  decorativeScene: ReactNode;
  promptText: string;
  children: ReactNode;
  gradientFrom: string;
  gradientTo: string;
}

export const ReflectionCardBase = ({
  decorativeScene,
  promptText,
  children,
  gradientFrom,
  gradientTo,
}: ReflectionCardBaseProps) => {
  return (
    <div className="w-full flex items-center justify-center px-4 py-4">
      <div 
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative"
        style={{
          background: `linear-gradient(135deg, hsl(var(${gradientFrom})), hsl(var(${gradientTo})))`,
          boxShadow: "0 20px 60px -10px rgba(0, 0, 0, 0.3), 0 0 40px rgba(var(--primary-rgb), 0.15)",
        }}
      >
        {/* Decorative Top Scene */}
        <div className="h-48 relative overflow-hidden bg-gradient-to-b from-background/10 to-transparent">
          {decorativeScene}
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center px-8 py-6 space-y-6">
          {/* Prompt Text */}
          <h2 className="text-2xl font-bold text-center text-foreground tracking-tight leading-tight">
            {promptText}
          </h2>

          {/* Input Area */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
