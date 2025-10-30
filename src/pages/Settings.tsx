import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Bell, Book, Download, Heart, Lock, Eye, Share2, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PrivacyToggleCard } from "@/components/PrivacyToggleCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useThemeContext } from "@/contexts/ThemeContext";

const Settings = () => {
  const navigate = useNavigate();
  const { dashboardTheme, setDashboardTheme } = useThemeContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState("friends");
  const [autoShareRecipes, setAutoShareRecipes] = useState(false);
  const [showBadgesToFriends, setShowBadgesToFriends] = useState(true);

  useEffect(() => {
    const loadPrivacySettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("profile_visibility, auto_share_recipes, show_badges_to_friends")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfileVisibility(data.profile_visibility || "friends");
        setAutoShareRecipes(data.auto_share_recipes || false);
        setShowBadgesToFriends(data.show_badges_to_friends ?? true);
      }
    };
    loadPrivacySettings();
  }, []);

  const updatePrivacySetting = async (field: string, value: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("profiles").update({ [field]: value }).eq("id", user.id);
    toast({ title: "Privacy settings updated" });
  };

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

          <div className="space-y-2 pt-2">
            <Label>Dashboard Mood</Label>
            <Select value={dashboardTheme} onValueChange={(val: any) => setDashboardTheme(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fresh-start">
                  <div className="flex items-center gap-2">
                    <span>☀️</span>
                    <span>Fresh Start — bright lavender + morning coral</span>
                  </div>
                </SelectItem>
                <SelectItem value="encouraging-energy">
                  <div className="flex items-center gap-2">
                    <span>🌈</span>
                    <span>Encouraging Energy — vibrant lilac + sparkles</span>
                  </div>
                </SelectItem>
                <SelectItem value="reflective-calm">
                  <div className="flex items-center gap-2">
                    <span>🌿</span>
                    <span>Reflective Calm — muted blue + journaling</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Changes the dashboard's color mood and ambient lighting</p>
          </div>
        </div>

        {/* Privacy & Sharing */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-foreground">Privacy & Sharing</h2>
            <span className="text-xs text-primary">🦦🔒</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Ottr protects your personal data.</p>

          <div className="space-y-2">
            <Label>Profile Visibility</Label>
            <Select value={profileVisibility} onValueChange={(val) => { setProfileVisibility(val); updatePrivacySetting("profile_visibility", val); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public — Everyone can see</SelectItem>
                <SelectItem value="friends">Friends — Friends only</SelectItem>
                <SelectItem value="private">Private — Only me</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <PrivacyToggleCard
            label="Auto-share recipes"
            description="Automatically share new recipes to friends"
            checked={autoShareRecipes}
            onCheckedChange={(val) => { setAutoShareRecipes(val); updatePrivacySetting("auto_share_recipes", val); }}
            icon={<Share2 className="w-5 h-5" />}
          />

          <PrivacyToggleCard
            label="Show badges to friends"
            description="Let friends see your unlocked achievements"
            checked={showBadgesToFriends}
            onCheckedChange={(val) => { setShowBadgesToFriends(val); updatePrivacySetting("show_badges_to_friends", val); }}
            icon={<Award className="w-5 h-5" />}
          />
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border space-y-4">
          <h2 className="text-base font-bold text-foreground">Notifications</h2>
          <PrivacyToggleCard
            label="Snack Reminders"
            description="Get notified when it's time for a healthy snack"
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
            icon={<Bell className="w-5 h-5" />}
          />
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
