import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendCard } from "@/components/FriendCard";
import { BadgeCard } from "@/components/BadgeCard";
import { AddFriendModal } from "@/components/AddFriendModal";
import { BadgeUnlockModal } from "@/components/BadgeUnlockModal";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useAppContext } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Edit, LogOut, UserPlus, Flame, Sparkles, 
  Users, ChefHat, Target, Trophy, Share2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import otterHappy from "@/assets/otter-happy.png";

const Account = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { xp, level, streak, getXPForNextLevel } = useAppContext();
  
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [sharedContent, setSharedContent] = useState<any[]>([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showBadgeUnlock, setShowBadgeUnlock] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadBadges();
      loadFriends();
      loadSharedContent();
    }
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();
    
    if (data) setProfile(data);
  };

  const loadBadges = async () => {
    const { data: allBadges } = await supabase
      .from("badges")
      .select("*")
      .order("points_required");
    
    const { data: unlockedBadges } = await supabase
      .from("user_badges")
      .select("*, badges(*)")
      .eq("user_id", user?.id);

    if (allBadges) setBadges(allBadges);
    if (unlockedBadges) setUserBadges(unlockedBadges);
  };

  const loadFriends = async () => {
    const { data } = await supabase
      .from("friendships")
      .select(`
        *,
        friend:profiles!friendships_friend_id_fkey(*)
      `)
      .eq("user_id", user?.id)
      .eq("status", "accepted");

    if (data) {
      const friendProfiles = data.map(f => ({
        ...f.friend,
        level: level,
        xp: xp,
        streak: streak,
      }));
      setFriends(friendProfiles);
    }
  };

  const loadSharedContent = async () => {
    const { data } = await supabase
      .from("shared_content")
      .select(`
        *,
        profiles(display_name, avatar_url)
      `)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) setSharedContent(data);
  };

  const handleAddFriend = async (method: string, value: string) => {
    // Mock implementation - would search for user and create friendship
    toast({
      title: "Friend request sent!",
      description: `Request sent via ${method}`,
    });
  };

  const handleSetFavoriteBadge = async (badgeId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ favorite_badge_id: badgeId })
      .eq("id", user?.id);

    if (!error) {
      toast({ title: "Favorite badge updated!" });
      loadProfile();
    }
  };

  const isBadgeUnlocked = (badgeId: string) => {
    return userBadges.some(ub => ub.badge_id === badgeId);
  };

  const xpPercentage = (xp / getXPForNextLevel()) * 100;
  const friendCount = friends.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-24">
      {/* Header */}
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
          <h1 className="text-xl font-bold text-foreground flex-1">Account</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="rounded-full active:scale-95 transition-transform"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.avatar_url || otterHappy} alt={profile?.display_name} />
              <AvatarFallback>{profile?.display_name?.[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground">
                {profile?.display_name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {profile?.title}
              </p>
              
              {/* Stats */}
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-streak" />
                  <span className="text-sm font-semibold text-foreground">{streak}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{friendCount}</span>
                </div>
              </div>
            </div>

            <Button variant="outline" size="icon" className="rounded-full">
              <Edit className="w-4 h-4" />
            </Button>
          </div>

          {/* Level & XP Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-bold text-foreground">Level {level}</span>
              </div>
              <span className="text-muted-foreground">{xp}/{getXPForNextLevel()} XP</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs for Badges, Friends, Shared */}
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="badges">
              <Trophy className="w-4 h-4 mr-2" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="friends">
              <Users className="w-4 h-4 mr-2" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="shared">
              <Share2 className="w-4 h-4 mr-2" />
              Shared
            </TabsTrigger>
          </TabsList>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-4">
            <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Your Badges
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    unlocked={isBadgeUnlocked(badge.id)}
                    isFavorite={profile?.favorite_badge_id === badge.id}
                    onSetFavorite={() => handleSetFavoriteBadge(badge.id)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-4">
            <Button
              className="w-full"
              onClick={() => setShowAddFriend(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Friend
            </Button>

            <div className="space-y-3">
              {friends.length === 0 ? (
                <div className="bg-card rounded-3xl p-8 text-center border-2 border-border">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No friends yet. Start connecting!
                  </p>
                </div>
              ) : (
                friends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onSendEncouragement={() => toast({ title: "Encouragement sent!" })}
                    onShareRecipe={() => toast({ title: "Recipe shared!" })}
                    onShareSnack={() => toast({ title: "Snack shared!" })}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* Shared Content Tab */}
          <TabsContent value="shared" className="space-y-4">
            {sharedContent.length === 0 ? (
              <div className="bg-card rounded-3xl p-8 text-center border-2 border-border">
                <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No shared content yet
                </p>
              </div>
            ) : (
              sharedContent.map((content) => (
                <div 
                  key={content.id}
                  className="bg-card rounded-2xl p-4 border-2 border-border shadow-[0_4px_20px_rgb(0,0,0,0.06)]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={content.profiles?.avatar_url} />
                      <AvatarFallback>{content.profiles?.display_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {content.profiles?.display_name}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-foreground mb-1">{content.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {content.description}
                  </p>
                  
                  {content.calories && (
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>{content.calories} cal</span>
                      {content.protein && <span>{content.protein}g protein</span>}
                    </div>
                  )}
                  
                  <Button size="sm" className="w-full mt-3">
                    Add to Quick Log
                  </Button>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <AddFriendModal
        open={showAddFriend}
        onOpenChange={setShowAddFriend}
        onAddFriend={handleAddFriend}
      />

      {unlockedBadge && (
        <BadgeUnlockModal
          open={showBadgeUnlock}
          onOpenChange={setShowBadgeUnlock}
          badgeName={unlockedBadge.name}
          badgeDescription={unlockedBadge.description}
        />
      )}

      <MobileBottomNav />
    </div>
  );
};

export default Account;
