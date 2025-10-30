import { useNavigate } from "react-router-dom";
import { OtterMascot } from "./OtterMascot";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

export const FriendsEmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="mb-6 scale-110">
        <OtterMascot mood="sleepy" message="" />
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-2 text-center">
        Looks quiet here... 🌊
      </h3>
      
      <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs">
        Invite a few friends to make waves together! Your social cove feels a bit empty without your pod.
      </p>

      <Button 
        onClick={() => {
          // Switch to discover tab
          window.dispatchEvent(new CustomEvent('switch-to-discover'));
        }}
        className="gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Find Friends in Discover
      </Button>
    </div>
  );
};
