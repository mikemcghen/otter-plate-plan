import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Minus, Search, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import otterEncourage from "@/assets/otter-encourage.png";

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  servings: number;
  photo?: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface RecipeCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (recipe: Recipe) => void;
}

export function RecipeCreationModal({ open, onOpenChange, onSave }: RecipeCreationModalProps) {
  const [recipeName, setRecipeName] = useState("");
  const [servings, setServings] = useState(1);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showIngredientSearch, setShowIngredientSearch] = useState(false);

  // Mock ingredient database
  const availableIngredients: Ingredient[] = [
    { id: "1", name: "Chicken Breast", amount: "100g", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { id: "2", name: "Brown Rice", amount: "1 cup", calories: 216, protein: 5, carbs: 45, fat: 1.8 },
    { id: "3", name: "Olive Oil", amount: "1 tbsp", calories: 119, protein: 0, carbs: 0, fat: 13.5 },
    { id: "4", name: "Broccoli", amount: "1 cup", calories: 55, protein: 4, carbs: 11, fat: 0.6 },
    { id: "5", name: "Tomato", amount: "1 medium", calories: 22, protein: 1, carbs: 5, fat: 0.2 },
  ];

  const filteredIngredients = searchQuery
    ? availableIngredients.filter((ing) =>
        ing.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableIngredients;

  const addIngredient = (ingredient: Ingredient) => {
    setIngredients([...ingredients, { ...ingredient, id: `${ingredient.id}-${Date.now()}` }]);
    setSearchQuery("");
    setShowIngredientSearch(false);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const calculateTotals = () => {
    return ingredients.reduce(
      (acc, ing) => ({
        calories: acc.calories + ing.calories,
        protein: acc.protein + ing.protein,
        carbs: acc.carbs + ing.carbs,
        fat: acc.fat + ing.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const handleSave = () => {
    if (!recipeName.trim()) {
      toast({
        title: "Recipe name required",
        description: "Please enter a name for your recipe",
        variant: "destructive",
      });
      return;
    }

    if (ingredients.length === 0) {
      toast({
        title: "Add ingredients",
        description: "Please add at least one ingredient",
        variant: "destructive",
      });
      return;
    }

    const totals = calculateTotals();
    const recipe: Recipe = {
      id: Date.now().toString(),
      name: recipeName,
      ingredients,
      servings,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
    };

    onSave(recipe);
    toast({
      title: "Recipe saved! 🎉",
      description: `${recipeName} is now in your recipes`,
    });
    handleClose();
  };

  const handleClose = () => {
    setRecipeName("");
    setServings(1);
    setIngredients([]);
    setSearchQuery("");
    setShowIngredientSearch(false);
    onOpenChange(false);
  };

  const totals = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-2xl rounded-3xl border-2 border-border p-0 overflow-hidden max-h-[90vh]">
        <DialogHeader className="p-6 pb-4 border-b border-border bg-gradient-to-b from-accent/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={otterEncourage} alt="Encouraging otter" className="w-10 h-10" />
              <DialogTitle className="text-2xl font-bold">Create Recipe</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6 space-y-6">
          {/* Recipe Name & Photo */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Recipe Name
              </label>
              <Input
                type="text"
                placeholder="e.g., Grilled Chicken Bowl"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="h-12 text-base border-2"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Recipe Photo (Optional)
              </label>
              <Button
                variant="outline"
                className="w-full h-24 border-2 border-dashed hover:border-primary hover:bg-primary/5"
              >
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload Photo</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Servings */}
          <div className="bg-gradient-to-r from-accent/5 to-primary/5 border-2 border-border rounded-2xl p-4">
            <p className="text-sm font-semibold text-foreground mb-3">Servings</p>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="h-10 w-10 rounded-full border-2"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="min-w-[60px] text-center">
                <p className="text-3xl font-bold text-primary">{servings}</p>
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
          </div>

          {/* Ingredients Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-foreground">Ingredients</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowIngredientSearch(!showIngredientSearch)}
                className="h-9 border-2"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            {/* Ingredient Search */}
            {showIngredientSearch && (
              <div className="mb-4 space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 border-2"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredIngredients.map((ing) => (
                    <button
                      key={ing.id}
                      onClick={() => addIngredient(ing)}
                      className="w-full text-left bg-card border border-border rounded-lg p-3 hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <p className="font-medium text-foreground">{ing.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ing.amount} • {ing.calories} cal
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Added Ingredients */}
            <div className="space-y-2">
              {ingredients.map((ing) => (
                <div
                  key={ing.id}
                  className="bg-card border-2 border-border rounded-xl p-3 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{ing.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ing.amount} • {ing.calories} cal
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(ing.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {ingredients.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No ingredients added yet
              </div>
            )}
          </div>

          {/* Recipe Totals */}
          {ingredients.length > 0 && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-2xl p-4">
              <h4 className="text-sm font-bold text-foreground mb-3">
                Total per serving ({servings} {servings === 1 ? "serving" : "servings"})
              </h4>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Calories</p>
                  <p className="text-lg font-bold text-foreground">
                    {Math.round(totals.calories / servings)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="text-lg font-bold text-primary">
                    {Math.round(totals.protein / servings)}g
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Carbs</p>
                  <p className="text-lg font-bold text-accent">
                    {Math.round(totals.carbs / servings)}g
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Fat</p>
                  <p className="text-lg font-bold text-orange-500">
                    {Math.round(totals.fat / servings)}g
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full h-12 bg-gradient-to-r from-accent to-accent/80 font-semibold text-lg"
          >
            Save Recipe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
