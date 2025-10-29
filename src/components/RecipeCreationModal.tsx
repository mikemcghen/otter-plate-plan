import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Minus, Search, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/useHaptics";
import { EmptyState } from "@/components/EmptyState";
import otterEncourage from "@/assets/otter-encourage.png";
import otterHappy from "@/assets/otter-happy.png";

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
  const { impact, notification } = useHaptics();
  const [currentStep, setCurrentStep] = useState(0); // 0: name, 1: ingredients, 2: servings
  const [recipeName, setRecipeName] = useState("");
  const [servings, setServings] = useState(4);
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
    { id: "6", name: "Avocado", amount: "1/2 fruit", calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
    { id: "7", name: "Salmon", amount: "100g", calories: 208, protein: 20, carbs: 0, fat: 13 },
    { id: "8", name: "Sweet Potato", amount: "1 medium", calories: 112, protein: 2, carbs: 26, fat: 0.1 },
    { id: "9", name: "Greek Yogurt", amount: "1 cup", calories: 100, protein: 17, carbs: 6, fat: 0.7 },
    { id: "10", name: "Spinach", amount: "1 cup", calories: 7, protein: 1, carbs: 1, fat: 0.1 },
  ];

  const filteredIngredients = searchQuery
    ? availableIngredients.filter((ing) =>
        ing.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableIngredients;

  const addIngredient = async (ingredient: Ingredient) => {
    await impact();
    setIngredients([...ingredients, { ...ingredient, id: `${ingredient.id}-${Date.now()}` }]);
    setShowIngredientSearch(false);
    setSearchQuery("");
  };

  const removeIngredient = async (id: string) => {
    await impact();
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

  const totals = calculateTotals();

  const handleNext = async () => {
    await impact();
    
    if (currentStep === 0 && recipeName.trim().length < 3) {
      toast({
        title: "Recipe name too short",
        description: "Please enter at least 3 characters",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 1 && ingredients.length === 0) {
      toast({
        title: "Add ingredients",
        description: "Your recipe needs at least one ingredient",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handleBack = async () => {
    await impact();
    setCurrentStep(currentStep - 1);
  };

  const handleSave = async () => {
    await notification("success");
    
    const recipe: Recipe = {
      id: `recipe-${Date.now()}`,
      name: recipeName.trim(),
      ingredients,
      servings,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
    };

    onSave(recipe);
    
    toast({
      title: "Recipe saved!",
      description: `${recipe.name} is ready to log`,
    });

    handleClose();
  };

  const handleClose = () => {
    setRecipeName("");
    setServings(4);
    setIngredients([]);
    setSearchQuery("");
    setShowIngredientSearch(false);
    setCurrentStep(0);
    onOpenChange(false);
  };

  const steps = ["Name", "Ingredients", "Servings"];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md h-[90vh] rounded-3xl border-2 border-border p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="p-4 pb-3 border-b border-border bg-gradient-to-b from-accent/5 to-transparent shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img 
                src={currentStep === 2 ? otterHappy : otterEncourage} 
                alt="Ottr" 
                className="w-10 h-10 animate-fade-in" 
              />
              <DialogTitle className="text-xl font-bold">
                {currentStep === 0 && "Name Your Recipe"}
                {currentStep === 1 && "Add Ingredients"}
                {currentStep === 2 && "Set Servings"}
              </DialogTitle>
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

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all ${
                      index <= currentStep
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      index <= currentStep ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-4 mx-1 rounded-full transition-colors ${
                      index < currentStep ? "bg-accent" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 0: Recipe Name */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  What's this delicious creation called?
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Grandma's Chicken Soup"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="h-12 text-base border-2 focus-visible:ring-2 focus-visible:ring-accent"
                  maxLength={50}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {recipeName.length}/50 characters
                </p>
              </div>

              <div className="bg-accent/10 rounded-2xl p-4 border-2 border-accent/20">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Pro tip:</strong> Give it a memorable name so you can find it quickly later!
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Ingredients */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              {/* Added Ingredients */}
              {ingredients.length > 0 && (
                <div className="space-y-2 mb-4">
                  <h3 className="text-sm font-bold text-foreground">Added ({ingredients.length})</h3>
                  {ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="flex items-center gap-3 p-3 bg-card border-2 border-border rounded-xl"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {ingredient.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {ingredient.amount} • {ingredient.calories} cal
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(ingredient.id)}
                        className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Running Total */}
                  <div className="bg-primary/10 rounded-xl p-3 border-2 border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">Total</span>
                      <span className="text-lg font-bold text-primary">
                        {totals.calories} cal
                      </span>
                    </div>
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                      <span>P: {totals.protein}g</span>
                      <span>C: {totals.carbs}g</span>
                      <span>F: {totals.fat}g</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Ingredient Button */}
              {!showIngredientSearch && (
                <>
                  {ingredients.length === 0 && (
                    <EmptyState
                      variant="encourage"
                      title="Add your first ingredient"
                      description="Build your recipe by adding ingredients one by one. Ottr will calculate the totals for you!"
                      className="py-4"
                    />
                  )}
                  <Button
                    onClick={async () => {
                      await impact();
                      setShowIngredientSearch(true);
                    }}
                    className="w-full h-12 rounded-2xl active:scale-95 transition-transform"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Ingredient
                  </Button>
                </>
              )}

              {/* Ingredient Search */}
              {showIngredientSearch && (
                <div className="space-y-3 animate-fade-in">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search ingredients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-base border-2 focus-visible:ring-2 focus-visible:ring-accent"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                    {filteredIngredients.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">
                          No ingredients found for "{searchQuery}"
                        </p>
                      </div>
                    ) : (
                      filteredIngredients.map((ingredient) => (
                        <button
                          key={ingredient.id}
                          onClick={() => addIngredient(ingredient)}
                          className="w-full flex items-center gap-3 p-3 bg-card border-2 border-border rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
                        >
                          <div className="flex-1 text-left">
                            <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                              {ingredient.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {ingredient.amount} • {ingredient.calories} cal
                            </p>
                          </div>
                          <Plus className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={async () => {
                      await impact();
                      setShowIngredientSearch(false);
                      setSearchQuery("");
                    }}
                    className="w-full h-12 rounded-2xl border-2"
                  >
                    Done Adding
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Servings */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground mb-6">
                  How many servings does this make?
                </p>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={async () => {
                      await impact();
                      setServings(Math.max(1, servings - 1));
                    }}
                    className="h-12 w-12 rounded-full border-2"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  
                  <div className="min-w-[100px] text-center">
                    <p className="text-5xl font-bold text-accent">{servings}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {servings === 1 ? "serving" : "servings"}
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={async () => {
                      await impact();
                      setServings(servings + 1);
                    }}
                    className="h-12 w-12 rounded-full border-2"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Per Serving Breakdown */}
              <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-5 border-2 border-accent/30">
                <h3 className="text-sm font-bold text-foreground mb-3">Per Serving</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card rounded-xl p-3 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Calories</p>
                    <p className="text-2xl font-bold text-primary">
                      {Math.round(totals.calories / servings)}
                    </p>
                  </div>
                  <div className="bg-card rounded-xl p-3 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Protein</p>
                    <p className="text-2xl font-bold text-accent">
                      {Math.round(totals.protein / servings)}g
                    </p>
                  </div>
                  <div className="bg-card rounded-xl p-3 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                    <p className="text-2xl font-bold text-success">
                      {Math.round(totals.carbs / servings)}g
                    </p>
                  </div>
                  <div className="bg-card rounded-xl p-3 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Fat</p>
                    <p className="text-2xl font-bold text-warning">
                      {Math.round(totals.fat / servings)}g
                    </p>
                  </div>
                </div>
              </div>

              {/* Recipe Summary */}
              <div className="bg-muted/50 rounded-2xl p-4 border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  RECIPE SUMMARY
                </p>
                <p className="text-base font-bold text-foreground mb-1">
                  {recipeName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ingredients.length} ingredients • {servings} servings
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-border bg-card shrink-0">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-12 rounded-2xl border-2 active:scale-95 transition-transform"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </Button>
            )}
            <Button
              onClick={currentStep === 2 ? handleSave : handleNext}
              className="flex-1 h-12 rounded-2xl active:scale-95 transition-transform"
              disabled={
                (currentStep === 0 && recipeName.trim().length < 3) ||
                (currentStep === 1 && ingredients.length === 0)
              }
            >
              {currentStep === 2 ? "Save Recipe" : "Next"}
              {currentStep < 2 && <ChevronRight className="w-5 h-5 ml-1" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
