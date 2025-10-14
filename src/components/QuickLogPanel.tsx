import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, TrendingUp, Clock, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import otterDancing from "@/assets/otter-dancing.png";
import otterHappy from "@/assets/otter-happy.png";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji?: string;
}

interface QuickLogPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLog: (food: FoodItem) => void;
}

export function QuickLogPanel({ open, onOpenChange, onLog }: QuickLogPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  // Mock data for recent & frequent foods
  const recentFoods: FoodItem[] = [
    { id: "1", name: "Grilled Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, emoji: "🍗" },
    { id: "2", name: "Brown Rice (1 cup)", calories: 216, protein: 5, carbs: 45, fat: 1.8, emoji: "🍚" },
    { id: "3", name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 0.7, emoji: "🥛" },
    { id: "4", name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, emoji: "🍌" },
    { id: "5", name: "Almonds (handful)", calories: 164, protein: 6, carbs: 6, fat: 14, emoji: "🥜" },
  ];

  // Smart suggestions based on time of day
  const smartSuggestions: FoodItem[] = [
    { id: "s1", name: "Protein Smoothie", calories: 200, protein: 20, carbs: 24, fat: 3, emoji: "🥤" },
    { id: "s2", name: "Mixed Nuts & Seeds", calories: 180, protein: 6, carbs: 8, fat: 15, emoji: "🌰" },
  ];

  const filteredFoods = searchQuery
    ? recentFoods.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentFoods;

  const handleLogFood = (food: FoodItem) => {
    setShowCelebration(true);
    onLog(food);
    
    toast({
      title: "Logged! 🎉",
      description: `${food.name} added • +15 XP`,
    });

    setTimeout(() => {
      setShowCelebration(false);
      onOpenChange(false);
      setSearchQuery("");
    }, 1500);
  };

  const handleCustomAdd = () => {
    toast({
      title: "Custom food entry",
      description: "Advanced logging coming soon!",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] rounded-t-3xl border-t-2 border-border p-0 overflow-hidden"
      >
        {/* Celebration Overlay */}
        {showCelebration && (
          <div className="absolute inset-0 z-50 bg-background/95 flex items-center justify-center animate-fade-in">
            <div className="text-center space-y-4 animate-scale-in">
              <img 
                src={otterDancing} 
                alt="Celebrating otter" 
                className="w-32 h-32 mx-auto animate-bounce"
              />
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-primary">Great job!</h3>
                <p className="text-lg text-muted-foreground">+15 XP earned 🌟</p>
              </div>
            </div>
          </div>
        )}

        <SheetHeader className="p-6 pb-4 border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <img 
              src={otterHappy} 
              alt="Happy otter" 
              className="w-12 h-12"
            />
            <div className="flex-1">
              <SheetTitle className="text-2xl font-bold text-left">Quick Log</SheetTitle>
              <p className="text-sm text-muted-foreground text-left">What did you eat?</p>
            </div>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto h-full pb-24 px-6">
          {/* Search Bar */}
          <div className="sticky top-0 bg-background py-4 z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base border-2 focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Recent & Frequent Foods */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="text-base font-bold text-foreground">Recent & Frequent</h3>
            </div>
            <div className="space-y-2">
              {filteredFoods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => handleLogFood(food)}
                  className="w-full bg-card border-2 border-border rounded-2xl p-4 hover:border-primary hover:bg-primary/5 transition-all group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{food.emoji}</div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {food.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          {food.calories} cal
                        </span>
                        <span className="text-xs text-muted-foreground">
                          P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                        </span>
                      </div>
                    </div>
                    <Plus className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Smart Suggestions */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-accent" />
              <h3 className="text-base font-bold text-foreground">Smart Suggestions</h3>
              <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full font-semibold">
                For you
              </span>
            </div>
            <div className="space-y-2">
              {smartSuggestions.map((food) => (
                <button
                  key={food.id}
                  onClick={() => handleLogFood(food)}
                  className="w-full bg-gradient-to-r from-accent/10 to-primary/10 border-2 border-accent/30 rounded-2xl p-4 hover:border-accent hover:from-accent/20 hover:to-primary/20 transition-all group focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{food.emoji}</div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                          {food.name}
                        </h4>
                        <TrendingUp className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          {food.calories} cal
                        </span>
                        <span className="text-xs text-muted-foreground">
                          P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                        </span>
                      </div>
                    </div>
                    <Plus className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Custom Quick Add */}
          <section className="mb-6">
            <Button
              onClick={handleCustomAdd}
              variant="outline"
              className="w-full h-auto py-6 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-2xl group transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <h4 className="font-semibold text-foreground">Add Custom Food</h4>
                  <p className="text-sm text-muted-foreground">Enter name and calories manually</p>
                </div>
              </div>
            </Button>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
