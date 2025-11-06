import { ReflectionCarousel } from "@/components/ReflectionCarousel";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DailyReflection() {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Close Button */}
      <Button
        onClick={() => navigate("/wellness")}
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-20 bg-background/80 backdrop-blur-sm hover:bg-background/90 rounded-full"
      >
        <X className="w-5 h-5" />
      </Button>

      <ReflectionCarousel />
    </div>
  );
}
