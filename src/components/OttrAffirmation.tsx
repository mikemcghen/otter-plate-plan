import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const affirmations = [
  "The cove feels peaceful today 🌊",
  "You're doing great, friend 💜",
  "Steady as the tide — consistency is key 🦦",
  "Every small step ripples outward ✨",
  "Balance is a journey, not a destination 🌿",
  "Your progress shines like sunlight on water ☀️",
  "The ocean teaches patience — you're learning well 💙",
];

export const OttrAffirmation = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hasShown = sessionStorage.getItem("ottr-affirmation-shown");
    if (hasShown) return;

    const randomDelay = 8000 + Math.random() * 7000; // 8-15s
    const timeout = setTimeout(() => {
      setMessage(affirmations[Math.floor(Math.random() * affirmations.length)]);
      setShow(true);
      sessionStorage.setItem("ottr-affirmation-shown", "true");
      
      // Auto-hide after 6 seconds
      setTimeout(() => setShow(false), 6000);
    }, randomDelay);

    return () => clearTimeout(timeout);
  }, []);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed top-24 left-1/2 -translate-x-1/2 z-30",
        "max-w-[260px] px-4 py-2 rounded-full",
        "bg-gradient-to-r from-primary/90 to-primary/80 backdrop-blur-sm",
        "border border-white/20 shadow-lg",
        "text-xs text-white/95 text-center font-medium",
        "animate-fade-in pointer-events-none"
      )}
      style={{
        animation: "fade-in 0.3s ease-out, float-drift 4s ease-in-out infinite",
      }}
    >
      {message}
    </div>
  );
};
