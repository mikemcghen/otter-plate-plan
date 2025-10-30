import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Waves, Users, Sparkles, TrendingUp, Filter } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { PostCard } from "@/components/PostCard";
import { PostModal } from "@/components/PostModal";
import { OtterMascot } from "@/components/OtterMascot";
import { FriendHighlightCard } from "@/components/FriendHighlightCard";
import { FriendActivityCard } from "@/components/FriendActivityCard";
import { FriendsEmptyState } from "@/components/FriendsEmptyState";
import { toast } from "sonner";

type ViewMode = "friends" | "discover";
type SortMode = "trending" | "new" | "popular" | "seasonal";

type Post = {
  id: string;
  image: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
    level: number;
    streak: number;
    badges: string[];
  };
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
  likes: number;
  downloads: number;
  comments: Array<{
    author: string;
    avatar: string;
    text: string;
  }>;
  tags: string[];
  isLiked?: boolean;
  isSaved?: boolean;
};

const Trends = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("friends");
  const [sortMode, setSortMode] = useState<SortMode>("trending");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showOtterMessage, setShowOtterMessage] = useState(true);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [hasFriends, setHasFriends] = useState(true); // Mock: set to false to see empty state

  // Listen for switch to discover event
  useEffect(() => {
    const handleSwitchToDiscover = () => {
      setViewMode("discover");
    };
    window.addEventListener('switch-to-discover', handleSwitchToDiscover);
    return () => window.removeEventListener('switch-to-discover', handleSwitchToDiscover);
  }, []);

  // Mock posts data
  const mockPosts: Post[] = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      title: "High-Protein Overnight Oats 🥣",
      description: "My go-to breakfast! Greek yogurt base with chia seeds, almond butter, and fresh berries. Keeps me full until lunch and tastes like dessert. Perfect for busy mornings!",
      author: {
        name: "Sarah M.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        level: 12,
        streak: 28,
        badges: ["Snack Sharer", "Breakfast Champion"],
      },
      macros: { protein: 32, carbs: 48, fat: 18, calories: 420 },
      likes: 142,
      downloads: 89,
      comments: [
        { author: "Mike R.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", text: "Just tried this! So good 🦦" },
        { author: "Lisa K.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa", text: "Adding to my weekly rotation!" },
      ],
      tags: ["BreakfastIdeas", "HighProtein", "QuickPrep"],
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
      title: "15-Day Streak Achievement! 🔥",
      description: "Hit my longest streak ever! Feeling amazing and the consistency is really paying off. Thank you to everyone who's been sending waves!",
      author: {
        name: "Alex T.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        level: 8,
        streak: 15,
        badges: ["Streak Master", "Community Chef"],
      },
      likes: 203,
      downloads: 0,
      comments: [
        { author: "Emma J.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", text: "You're crushing it! 🌊" },
      ],
      tags: ["Achievement", "Motivation"],
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400",
      title: "Rainbow Buddha Bowl 🌈",
      description: "Colorful, balanced, and SO satisfying. Quinoa, roasted chickpeas, avocado, purple cabbage, and tahini dressing. Takes 20 minutes!",
      author: {
        name: "Jordan P.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
        level: 15,
        streak: 42,
        badges: ["Community Chef", "Veggie Master", "Friendly Ottr"],
      },
      macros: { protein: 24, carbs: 62, fat: 28, calories: 580 },
      likes: 187,
      downloads: 156,
      comments: [
        { author: "Taylor B.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor", text: "Made this for meal prep Sunday!" },
        { author: "Sam D.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam", text: "Perfect macro balance 💚" },
      ],
      tags: ["LunchIdeas", "Vegetarian", "MealPrep"],
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1604467715878-83e57e08aae7?w=400",
      title: "Energy Bites for On-the-Go 🍪",
      description: "No-bake, dates + almond butter + oats + dark chocolate chips. Perfect pre-workout snack or afternoon pick-me-up!",
      author: {
        name: "Maya L.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
        level: 10,
        streak: 21,
        badges: ["Snack Sharer", "Encourager"],
      },
      macros: { protein: 8, carbs: 22, fat: 12, calories: 220 },
      likes: 168,
      downloads: 124,
      comments: [
        { author: "Chris W.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris", text: "These are addictive! 🦦" },
      ],
      tags: ["QuickSnacks", "PreWorkout", "NoBake"],
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
      title: "Pancake Sunday Tradition 🥞",
      description: "Started a weekly pancake ritual with protein powder blended in. Topped with Greek yogurt and berries. Makes Sundays special!",
      author: {
        name: "Riley N.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riley",
        level: 9,
        streak: 19,
        badges: ["Weekend Warrior", "Snack Sharer"],
      },
      macros: { protein: 28, carbs: 52, fat: 14, calories: 440 },
      likes: 211,
      downloads: 98,
      comments: [
        { author: "Jamie F.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie", text: "Love this idea! 🌊" },
        { author: "Pat K.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pat", text: "Stealing this tradition!" },
      ],
      tags: ["BreakfastIdeas", "WeekendVibes"],
    },
    {
      id: "6",
      image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400",
      title: "Unlocked Community Chef Badge! 🏆",
      description: "So proud! Shared 10 recipes this month and got so much positive feedback. This community is the best!",
      author: {
        name: "Casey H.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey",
        level: 14,
        streak: 35,
        badges: ["Community Chef", "Snack Sharer", "Encourager", "Friendly Ottr"],
      },
      likes: 276,
      downloads: 0,
      comments: [
        { author: "Blake S.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Blake", text: "Well deserved! Your recipes are amazing!" },
      ],
      tags: ["Achievement", "Community"],
    },
  ];

  // Mock friend highlights data
  const mockHighlights = [
    {
      id: "h1",
      type: "streak" as const,
      friend: { name: "Alex T.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
      title: "15-Day Streak!",
      description: "Hit their longest streak ever",
      icon: "🔥"
    },
    {
      id: "h2",
      type: "badge" as const,
      friend: { name: "Casey H.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey" },
      title: "Community Chef",
      description: "Shared 10 recipes this month",
      icon: "🏆"
    },
    {
      id: "h3",
      type: "milestone" as const,
      friend: { name: "Jordan P.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan" },
      title: "Hydration Hero",
      description: "7 days of perfect water intake",
      icon: "💧"
    },
  ];

  // Mock friend activities data
  const mockActivities = [
    {
      id: "a1",
      type: "recipe" as const,
      friend: {
        name: "Sarah M.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        level: 12,
        streak: 28,
        badges: ["Breakfast Champion"]
      },
      timestamp: "2h ago",
      content: {
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        title: "High-Protein Overnight Oats 🥣",
        text: "Perfect for busy mornings!"
      },
      likes: 24,
      comments: 5,
      isLiked: false
    },
    {
      id: "a2",
      type: "accomplishment" as const,
      friend: {
        name: "Alex T.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        level: 8,
        streak: 15,
        badges: ["Streak Master"]
      },
      timestamp: "4h ago",
      content: {
        achievement: "Streak Master",
        icon: "🔥",
        text: "15 days of consistent logging!"
      },
      likes: 42,
      comments: 8,
      isLiked: true
    },
    {
      id: "a3",
      type: "update" as const,
      friend: {
        name: "Jordan P.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
        level: 15,
        streak: 42,
        badges: ["Veggie Master", "Community Chef"]
      },
      timestamp: "6h ago",
      content: {
        text: "Hit my hydration goal 5 days straight! Feeling so much more energized 💧",
        icon: "💪"
      },
      likes: 18,
      comments: 3,
      isLiked: false
    },
    {
      id: "a4",
      type: "recipe" as const,
      friend: {
        name: "Maya L.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
        level: 10,
        streak: 21,
        badges: ["Snack Sharer"]
      },
      timestamp: "1d ago",
      content: {
        image: "https://images.unsplash.com/photo-1604467715878-83e57e08aae7?w=400",
        title: "Energy Bites for On-the-Go 🍪",
        text: "No-bake and perfect for pre-workout!"
      },
      likes: 31,
      comments: 7,
      isLiked: true
    },
    {
      id: "a5",
      type: "update" as const,
      friend: {
        name: "Riley N.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riley",
        level: 9,
        streak: 19,
        badges: ["Weekend Warrior"]
      },
      timestamp: "1d ago",
      content: {
        text: "Trying out the Overnight Oats trend everyone's talking about! 🥣",
        icon: "🦦"
      },
      likes: 15,
      comments: 4,
      isLiked: false
    }
  ];

  const filteredPosts = mockPosts; // In real app, filter based on viewMode and sortMode

  const handleViewModeToggle = (mode: ViewMode) => {
    setViewMode(mode);
    setShowOtterMessage(true);
    setTimeout(() => setShowOtterMessage(false), 3000);
  };

  const handleLike = (activityId: string) => {
    toast.success("Liked! 💜");
  };

  const handleComment = (activityId: string) => {
    toast.info("Comments coming soon! 💬");
  };

  const handleWave = (activityId: string) => {
    toast.success("Wave sent! 🌊");
  };

  const sortLabels = {
    trending: "Trending",
    new: "New",
    popular: "Most Downloaded",
    seasonal: "Seasonal",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full hover:bg-muted active:scale-95 transition-all flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground flex-1">
            Social Cove {viewMode === "friends" ? "🦦" : "🌊"}
          </h1>
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="w-9 h-9 rounded-full hover:bg-muted active:scale-95 transition-all flex items-center justify-center relative"
          >
            <Filter className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="max-w-md mx-auto px-4 pb-3">
          <div className="flex gap-2 bg-muted rounded-2xl p-1">
            <button
              onClick={() => handleViewModeToggle("friends")}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                viewMode === "friends"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              <Users className="w-4 h-4 inline mr-1" />
              Friends
            </button>
            <button
              onClick={() => handleViewModeToggle("discover")}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                viewMode === "discover"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-1" />
              Discover
            </button>
          </div>
        </div>

        {/* Sort Menu */}
        {showSortMenu && (
          <div className="absolute right-4 top-16 bg-card rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.15)] border-2 border-border p-2 z-50 animate-scale-in min-w-[160px]">
            {(Object.keys(sortLabels) as SortMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setSortMode(mode);
                  setShowSortMenu(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  sortMode === mode
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {sortLabels[mode]}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-md mx-auto px-4 py-6 pb-6">
        {/* Friends Tab */}
        {viewMode === "friends" && (
          <>
            {/* Ottr Message */}
            {showOtterMessage && (
              <div className="mb-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-5 border-2 border-primary/30 animate-slide-in-right">
                <OtterMascot 
                  mood="joyful" 
                  message="Your friends are making waves! 🌊" 
                />
              </div>
            )}

            {hasFriends ? (
              <>
                {/* Friend Highlights of the Week */}
                <div className="mb-6">
                  <h2 className="text-base font-bold text-foreground mb-3 px-1">
                    ✨ Friend Highlights of the Week
                  </h2>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                    {mockHighlights.map((highlight) => (
                      <FriendHighlightCard key={highlight.id} highlight={highlight} />
                    ))}
                  </div>
                </div>

                {/* Ottr's Pod Message */}
                <div className="mb-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-4 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🦦</span>
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">Ottr loves</span> seeing your pod stay consistent! Keep it up! 💜
                    </p>
                  </div>
                </div>

                {/* Friend Activity Feed */}
                <div className="space-y-4">
                  {mockActivities.map((activity) => (
                    <FriendActivityCard 
                      key={activity.id} 
                      activity={activity}
                      onLike={() => handleLike(activity.id)}
                      onComment={() => handleComment(activity.id)}
                      onWave={() => handleWave(activity.id)}
                    />
                  ))}
                </div>

                {/* Friend Trends Button */}
                <div className="mt-8">
                  <button
                    onClick={() => navigate("/weekly-check-in")}
                    className="w-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-5 border-2 border-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Waves className="w-5 h-5 text-primary" />
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1">
                      View Friend Trends
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      See how your friends are progressing this week
                    </p>
                  </button>
                </div>
              </>
            ) : (
              <FriendsEmptyState />
            )}
          </>
        )}

        {/* Discover Tab */}
        {viewMode === "discover" && (
          <>
            {/* Ottr Message */}
            {showOtterMessage && (
              <div className="mb-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-5 border-2 border-primary/30 animate-slide-in-right">
                <OtterMascot 
                  mood="joyful" 
                  message="Discover amazing snacks & recipes! ✨" 
                />
              </div>
            )}

            {/* Ottr's Picks Banner */}
            <div className="mb-6 bg-gradient-to-r from-primary to-accent rounded-3xl p-5 text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-fade-in">
              <h2 className="text-lg font-bold text-primary-foreground mb-1">
                🦦 Ottr's Picks
              </h2>
              <p className="text-sm text-primary-foreground/90">
                Trending in the community this week
              </p>
            </div>

            {/* Masonry Grid */}
            <div className="grid grid-cols-2 gap-4 auto-rows-auto">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  image={post.image}
                  title={post.title}
                  likes={post.likes}
                  downloads={post.downloads}
                  author={post.author}
                  onClick={() => setSelectedPost(post)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Post Modal */}
      <PostModal 
        post={selectedPost} 
        isOpen={!!selectedPost} 
        onClose={() => setSelectedPost(null)} 
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Trends;
