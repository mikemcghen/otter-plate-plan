import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, TrendingUp, Clock, Zap, Camera, ChefHat, X, Minus, Drumstick, Wheat, Milk, Banana, Apple, CupSoda } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/EmptyState";
import otterDancing from "@/assets/otter-dancing.png";
import otterHappy from "@/assets/otter-happy.png";
import { BarcodeScannerModal } from "./BarcodeScannerModal";
import { RecipeCreationModal } from "./RecipeCreationModal";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  icon?: string;
}

// Icon mapping for food items
const foodIconMap: Record<string, any> = {
  drumstick: Drumstick,
  wheat: Wheat,
  milk: Milk,
  banana: Banana,
  apple: Apple,
  "cup-soda": CupSoda,
};

interface QuickLogPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLog: (food: FoodItem) => void;
}

export function QuickLogPanel({ open, onOpenChange, onLog }: QuickLogPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showRecipeCreation, setShowRecipeCreation] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);

  // Mock data for recent & frequent foods
  const recentFoods: FoodItem[] = [
    { id: "1", name: "Grilled Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, icon: "drumstick" },
    { id: "2", name: "Brown Rice (1 cup)", calories: 216, protein: 5, carbs: 45, fat: 1.8, icon: "wheat" },
    { id: "3", name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 0.7, icon: "milk" },
    { id: "4", name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, icon: "banana" },
    { id: "5", name: "Almonds (handful)", calories: 164, protein: 6, carbs: 6, fat: 14, icon: "apple" },
  ];

  // Smart suggestions based on time of day
  const smartSuggestions: FoodItem[] = [
    { id: "s1", name: "Protein Smoothie", calories: 200, protein: 20, carbs: 24, fat: 3, icon: "cup-soda" },
    { id: "s2", name: "Mixed Nuts & Seeds", calories: 180, protein: 6, carbs: 8, fat: 15, icon: "apple" },
  ];

  const filteredFoods = searchQuery
    ? recentFoods.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentFoods;

  const handleLogFood = (food: FoodItem) => {
    setShowCelebration(true);
    onLog(food);
    
    setTimeout(() => {
      setShowCelebration(false);
      onOpenChange(false);
      setSearchQuery("");
    }, 1500);
  };

  const handleBarcodeLog = (product: any, servings: number) => {
    const food: FoodItem = {
      id: product.barcode,
      name: `${product.name} (${servings}x)`,
      calories: product.calories * servings,
      protein: product.protein * servings,
      carbs: product.carbs * servings,
      fat: product.fat * servings,
    };
    handleLogFood(food);
  };

  const handleRecipeSave = (recipe: any) => {
    setSavedRecipes([...savedRecipes, recipe]);
  };

  const handleRecipeLog = (recipe: any, servings: number) => {
    const caloriesPerServing = recipe.totalCalories / recipe.servings;
    const food: FoodItem = {
      id: recipe.id,
      name: `${recipe.name} (${servings} ${servings === 1 ? 'serving' : 'servings'})`,
      calories: Math.round(caloriesPerServing * servings),
      protein: Math.round((recipe.totalProtein / recipe.servings) * servings),
      carbs: Math.round((recipe.totalCarbs / recipe.servings) * servings),
      fat: Math.round((recipe.totalFat / recipe.servings) * servings),
    };
    handleLogFood(food);
  };

  const handleCustomAdd = () => {
    toast({
      title: "Custom food entry",
      description: "Advanced logging coming soon!",
    });
  };

  return (
    <>
      <BarcodeScannerModal
        open={showBarcodeScanner}
        onOpenChange={setShowBarcodeScanner}
        onLog={handleBarcodeLog}
      />
      
      <RecipeCreationModal
        open={showRecipeCreation}
        onOpenChange={setShowRecipeCreation}
        onSave={handleRecipeSave}
      />

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
                className="w-32 h-32 mx-auto"
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
            {filteredFoods.length === 0 && searchQuery ? (
              <div className="py-4">
                <EmptyState
                  variant="concerned"
                  title="No foods found"
                  description="Try a different search or add a custom food entry below."
                  className="py-4"
                />
              </div>
            ) : (
              <div className="space-y-2">
              {filteredFoods.map((food) => {
                const FoodIcon = food.icon ? foodIconMap[food.icon] || Apple : Apple;
                return (
                  <button
                    key={food.id}
                    onClick={() => handleLogFood(food)}
                    className="w-full bg-card border-2 border-border rounded-2xl p-4 hover:border-primary hover:bg-primary/5 transition-all group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FoodIcon className="w-6 h-6 text-primary" />
                      </div>
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
                );
              })}
            </div>
            )}
          </section>

          {/* Barcode Scanner & Recipe Buttons */}
          <section className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowBarcodeScanner(true)}
                variant="outline"
                className="h-auto py-6 border-2 border-border hover:border-primary hover:bg-primary/5 rounded-2xl group transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-foreground text-sm">Scan Barcode</h4>
                    <p className="text-xs text-muted-foreground">Quick scan</p>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => setShowRecipeCreation(true)}
                variant="outline"
                className="h-auto py-6 border-2 border-border hover:border-accent hover:bg-accent/5 rounded-2xl group transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <ChefHat className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-foreground text-sm">Add Recipe</h4>
                    <p className="text-xs text-muted-foreground">Create new</p>
                  </div>
                </div>
              </Button>
            </div>
          </section>

          {/* Saved Recipes */}
          {savedRecipes.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <ChefHat className="w-4 h-4 text-accent" />
                <h3 className="text-base font-bold text-foreground">My Recipes</h3>
              </div>
              <div className="space-y-2">
                {savedRecipes.map((recipe) => (
                  <RecipeLogButton
                    key={recipe.id}
                    recipe={recipe}
                    onLog={handleRecipeLog}
                  />
                ))}
              </div>
            </section>
          )}

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
              {smartSuggestions.map((food) => {
                const FoodIcon = food.icon ? foodIconMap[food.icon] || Apple : Apple;
                return (
                  <button
                    key={food.id}
                    onClick={() => handleLogFood(food)}
                    className="w-full bg-gradient-to-r from-accent/10 to-primary/10 border-2 border-accent/30 rounded-2xl p-4 hover:border-accent hover:from-accent/20 hover:to-primary/20 transition-all group focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <FoodIcon className="w-6 h-6 text-accent" />
                      </div>
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
                );
              })}
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
    </>
  );
}

// Recipe Log Button Component
interface RecipeLogButtonProps {
  recipe: any;
  onLog: (recipe: any, servings: number) => void;
}

function RecipeLogButton({ recipe, onLog }: RecipeLogButtonProps) {
  const [servings, setServings] = useState(1);
  const [showServingPicker, setShowServingPicker] = useState(false);

  const caloriesPerServing = Math.round(recipe.totalCalories / recipe.servings);
  const proteinPerServing = Math.round(recipe.totalProtein / recipe.servings);
  const carbsPerServing = Math.round(recipe.totalCarbs / recipe.servings);
  const fatPerServing = Math.round(recipe.totalFat / recipe.servings);

  const handleLog = () => {
    onLog(recipe, servings);
    setShowServingPicker(false);
    setServings(1);
  };

  if (showServingPicker) {
    return (
      <div className="w-full bg-gradient-to-r from-accent/10 to-primary/10 border-2 border-accent/30 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-foreground">{recipe.name}</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowServingPicker(false)}
            className="h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setServings(Math.max(1, servings - 1))}
            className="h-10 w-10 rounded-full border-2"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <div className="min-w-[80px] text-center">
            <p className="text-3xl font-bold text-accent">{servings}</p>
            <p className="text-xs text-muted-foreground">
              {servings === 1 ? 'serving' : 'servings'}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setServings(servings + 1)}
            className="h-10 w-10 rounded-full border-2"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={handleLog}
          className="w-full bg-gradient-to-r from-accent to-accent/80 font-semibold"
        >
          Log Recipe
        </Button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowServingPicker(true)}
      className="w-full bg-gradient-to-r from-accent/10 to-primary/10 border-2 border-accent/30 rounded-2xl p-4 hover:border-accent hover:from-accent/20 hover:to-primary/20 transition-all group focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <ChefHat className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1 text-left">
          <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
            {recipe.name}
          </h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm font-medium text-muted-foreground">
              {caloriesPerServing} cal/serving
            </span>
            <span className="text-xs text-muted-foreground">
              P: {proteinPerServing}g • C: {carbsPerServing}g • F: {fatPerServing}g
            </span>
          </div>
        </div>
        <Plus className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
}
