import { useNavigate, useLocation } from "react-router-dom";
import { Home, Plus, Scale, Waves, User } from "lucide-react";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  isQuickLog?: boolean;
}

interface MobileBottomNavProps {
  onQuickLog?: () => void;
}

export const MobileBottomNav = ({ onQuickLog }: MobileBottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { impact } = useHaptics();

  const navItems: NavItem[] = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Scale, label: "Weigh-In", path: "/check-in" },
    { icon: Plus, label: "Quick Log", path: "/quick-log", isQuickLog: true },
    { icon: Waves, label: "Social Cove", path: "/trends" },
    { icon: User, label: "Account", path: "/account" },
  ];

  const handleNavClick = async (item: NavItem) => {
    await impact();
    
    if (item.isQuickLog && onQuickLog) {
      onQuickLog();
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-screen-sm mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[60px] h-full relative transition-all duration-200",
                "active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {/* Quick Log FAB style */}
              {item.isQuickLog ? (
                <div className="absolute -top-6 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                  <Icon className="w-6 h-6" />
                </div>
              ) : (
                <>
                  <Icon className={cn("w-6 h-6 transition-transform", isActive && "scale-110")} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
