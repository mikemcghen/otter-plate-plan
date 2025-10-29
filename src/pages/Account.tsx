import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendCard } from "@/components/FriendCard";
import { BadgeCard } from "@/components/BadgeCard";
import { AddFriendModal } from "@/components/AddFriendModal";
import { BadgeUnlockModal } from "@/components/BadgeUnlockModal";
import { ShareContentModal } from "@/components/ShareContentModal";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useAppContext } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Edit, LogOut, UserPlus, Flame, Sparkles, 
  Users, ChefHat, Target, Trophy, Share2, Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
  const [showShareContent, setShowShareContent] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<any>(null);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  useEffect(() => {
    // Always load available badges so the section isn't empty for signed-out users
    loadBadges();

    if (user) {
      loadProfile();
      loadFriends();
      loadSharedContent();
      loadPendingRequests();
    } else {
      // Clear user-specific unlocks when signed out
      setUserBadges([]);
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

    if (allBadges) setBadges(allBadges);
    else setBadges([]);

    if (user?.id) {
      const { data: unlockedBadges } = await supabase
        .from("user_badges")
        .select("*, badges(*)")
        .eq("user_id", user.id);
      if (unlockedBadges) setUserBadges(unlockedBadges);
      else setUserBadges([]);
    } else {
      setUserBadges([]);
    }
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

  const loadPendingRequests = async () => {
    const { data } = await supabase
      .from("friendships")
      .select(`
        *,
        requester:profiles!friendships_user_id_fkey(*)
      `)
      .eq("friend_id", user?.id)
      .eq("status", "pending");

    if (data) setPendingRequests(data);
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

  const handleAcceptRequest = async (friendshipId: string) => {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", friendshipId);

    if (!error) {
      toast({ title: "Friend request accepted!" });
      loadPendingRequests();
      loadFriends();
    }
  };

  const handleRejectRequest = async (friendshipId: string) => {
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId);

    if (!error) {
      toast({ title: "Friend request rejected" });
      loadPendingRequests();
    }
  };

  const handleShareContent = async (content: any) => {
    const { error } = await supabase
      .from("shared_content")
      .insert({
        user_id: user?.id,
        title: content.title,
        description: content.description,
        content_type: content.type,
        calories: content.calories,
        protein: content.protein,
        carbs: content.carbs,
        fat: content.fat,
      });

    if (!error) {
      toast({ title: "Content shared with friends!" });
      loadSharedContent();
    }
  };

  const xpPercentage = (xp / getXPForNextLevel()) * 100;
  const friendCount = friends.length;
  
  // Get favorite badge details
  const favoriteBadge = badges.find(b => b.id === profile?.favorite_badge_id);

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
        {/* Profile Header - Enhanced */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border space-y-5 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-primary/20 shadow-lg">
                <AvatarImage src={profile?.avatar_url || otterHappy} alt={profile?.display_name} />
                <AvatarFallback className="text-2xl">{profile?.display_name?.[0]}</AvatarFallback>
              </Avatar>
              {/* Favorite Badge Indicator */}
              {favoriteBadge && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-full border-4 border-card flex items-center justify-center shadow-lg animate-bounce-subtle">
                  <Trophy className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                {profile?.display_name || user?.email?.split('@')[0]}
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                {profile?.title || "Snack Apprentice"}
              </p>
              
              {/* Stats Row */}
              <div className="flex gap-4 pt-1">
                <div className="flex items-center gap-1.5 bg-streak/10 px-3 py-1.5 rounded-full">
                  <Flame className="w-4 h-4 text-streak" />
                  <span className="text-sm font-bold text-foreground">{streak}</span>
                  <span className="text-xs text-muted-foreground">day</span>
                </div>
                <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">{friendCount}</span>
                  <span className="text-xs text-muted-foreground">friends</span>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full active:scale-95 transition-transform"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Favorite Badge Display */}
          {favoriteBadge && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-3 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">Favorite Badge</p>
                  <p className="text-sm font-bold text-foreground truncate">{favoriteBadge.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Level & XP Bar - Enhanced */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <span className="font-bold text-foreground text-base">Level {level}</span>
              </div>
              <span className="text-muted-foreground font-medium">{xp}/{getXPForNextLevel()} XP</span>
            </div>
            <div className="relative h-3 rounded-full bg-muted overflow-hidden">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
              {xpPercentage > 80 && (
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              )}
            </div>
          </div>
        </div>

        {/* Friends Preview Carousel */}
        {friends.length > 0 && (
          <div className="bg-card rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Friends
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddFriend(true)}>
                <UserPlus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform"
                >
                  <Avatar className="w-16 h-16 border-2 border-primary/30">
                    <AvatarImage src={friend.avatar_url} />
                    <AvatarFallback>{friend.display_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-semibold text-foreground text-center w-16 truncate">
                    {friend.display_name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Achievements Carousel */}
        {userBadges.length > 0 && (
          <div className="bg-card rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Recent Achievements
              </h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {userBadges.slice(0, 5).map((ub) => (
                <div
                  key={ub.id}
                  className="flex-shrink-0 flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl border border-accent/20 min-w-[100px]"
                >
                  <Trophy className="w-8 h-8 text-accent" />
                  <p className="text-xs font-bold text-foreground text-center line-clamp-2">
                    {ub.badges?.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

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

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div className="bg-card rounded-3xl p-4 border-2 border-primary/50">
                <h4 className="text-sm font-bold text-foreground mb-3">
                  Friend Requests ({pendingRequests.length})
                </h4>
                <div className="space-y-2">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center gap-3 p-3 bg-muted rounded-2xl"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={request.requester?.avatar_url} />
                        <AvatarFallback>{request.requester?.display_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {request.requester?.display_name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
            <Button
              className="w-full"
              onClick={() => setShowShareContent(true)}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Content
            </Button>

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

        {/* Account Controls Section */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border space-y-4">
          <h3 className="text-base font-bold text-foreground mb-4">Account</h3>
          
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Theme</span>
            </div>
            <ThemeToggle />
          </div>

          <Separator />

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto p-4 rounded-2xl"
            onClick={() => navigate("/settings")}
          >
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">Settings & Privacy</p>
              <p className="text-xs text-muted-foreground">Manage your account preferences</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto p-4 rounded-2xl text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={signOut}
          >
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">Sign Out</p>
              <p className="text-xs text-muted-foreground">See you later, Ottr friend! 🦦</p>
            </div>
          </Button>
        </div>
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

      <ShareContentModal
        open={showShareContent}
        onOpenChange={setShowShareContent}
        onShare={handleShareContent}
      />

      <MobileBottomNav />
    </div>
  );
};

export default Account;
