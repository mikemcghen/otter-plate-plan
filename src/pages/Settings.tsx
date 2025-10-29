import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Moon, Sun, Bell, Book, Download, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const Settings = () => {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-24">
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground flex-1">Settings</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Theme Section */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border space-y-4">
          <h2 className="text-base font-bold text-foreground">Appearance</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Dark Mode</span>
            <ThemeToggle />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border space-y-4">
          <h2 className="text-base font-bold text-foreground">Notifications</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Snack Reminders</span>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </div>

        {/* Data & Content */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border space-y-3">
          <h2 className="text-base font-bold text-foreground mb-3">Data & Content</h2>
          
          <Button
            variant="outline"
            className="w-full justify-start h-12 border-2"
            onClick={() => toast({ title: "Recipe management coming soon!" })}
          >
            <Book className="w-5 h-5 mr-3" />
            Manage Recipes
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-12 border-2"
            onClick={() => toast({ title: "Export feature coming soon!" })}
          >
            <Download className="w-5 h-5 mr-3" />
            Export My Data
          </Button>
        </div>

        {/* About */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border text-center space-y-2">
          <p className="text-sm text-muted-foreground">OttrCal v1.0</p>
          <div className="flex items-center justify-center gap-1">
            <p className="text-xs text-muted-foreground">Made with</p>
            <Heart className="w-3 h-3 text-primary fill-primary" />
            <p className="text-xs text-muted-foreground">by your friendly otter coach</p>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default Settings;
