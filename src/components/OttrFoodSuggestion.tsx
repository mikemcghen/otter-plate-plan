import { useState } from "react";
import { cn } from "@/lib/utils";
import { OtterMascot } from "./OtterMascot";

interface FoodSuggestion {
  name: string;
  emoji: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  reason: string;
}

interface OttrFoodSuggestionProps {
  caloriesRemaining: number;
  proteinRemaining: number;
  carbsRemaining: number;
  fatRemaining: number;
  onLogFood: (food: { name: string; calories: number; protein: number; carbs: number; fat: number }) => void;
}

export const OttrFoodSuggestion = ({
  caloriesRemaining,
  proteinRemaining,
  carbsRemaining,
  fatRemaining,
  onLogFood,
}: OttrFoodSuggestionProps) => {
  const [isLogging, setIsLogging] = useState(false);

  const getTimeOfDay = (): "breakfast" | "lunch" | "dinner" | "snack" => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return "breakfast";
    if (hour >= 11 && hour < 14) return "lunch";
    if (hour >= 17 && hour < 20) return "dinner";
    return "snack";
  };

  const getSuggestion = (): FoodSuggestion | null => {
    // If over calorie goal, return null for balance reminder
    if (caloriesRemaining < 0) return null;

    const timeOfDay = getTimeOfDay();
    const isHighProteinNeeded = proteinRemaining > 20;
    const isHighCarbsNeeded = carbsRemaining > 30;
    const isHighFatNeeded = fatRemaining > 15;

    // Meal suggestions
    const meals: Record<string, FoodSuggestion[]> = {
      breakfast: [
        { name: "Greek Yogurt Bowl", emoji: "🥣", protein: 20, carbs: 35, fat: 8, calories: 280, reason: "Perfect protein-packed breakfast!" },
        { name: "Avocado Toast", emoji: "🥑", protein: 12, carbs: 30, fat: 18, calories: 320, reason: "Balanced energy to start your day!" },
        { name: "Scrambled Eggs", emoji: "🍳", protein: 18, carbs: 5, fat: 12, calories: 200, reason: "You're a bit low on protein — try this!" },
      ],
      lunch: [
        { name: "Grilled Chicken Salad", emoji: "🥗", protein: 35, carbs: 20, fat: 12, calories: 340, reason: "Light and protein-rich for your afternoon!" },
        { name: "Quinoa Buddha Bowl", emoji: "🍜", protein: 15, carbs: 45, fat: 14, calories: 380, reason: "Balanced nutrition for sustained energy!" },
        { name: "Turkey Wrap", emoji: "🌯", protein: 28, carbs: 38, fat: 10, calories: 360, reason: "Perfect midday fuel!" },
      ],
      dinner: [
        { name: "Salmon with Veggies", emoji: "🐟", protein: 30, carbs: 25, fat: 18, calories: 400, reason: "Omega-3s and protein for the evening!" },
        { name: "Chicken Stir Fry", emoji: "🍲", protein: 32, carbs: 40, fat: 12, calories: 420, reason: "Colorful and satisfying dinner!" },
        { name: "Lentil Curry", emoji: "🍛", protein: 18, carbs: 50, fat: 10, calories: 380, reason: "Plant-based protein and comfort!" },
      ],
    };

    // Snack suggestions
    const snacks: FoodSuggestion[] = [
      { name: "Almonds", emoji: "🥜", protein: 6, carbs: 6, fat: 14, calories: 160, reason: "Great healthy fat boost!" },
      { name: "Apple with Peanut Butter", emoji: "🍎", protein: 8, carbs: 25, fat: 8, calories: 200, reason: "Perfect sweet and protein combo!" },
      { name: "Protein Shake", emoji: "🥤", protein: 25, carbs: 10, fat: 3, calories: 170, reason: "Quick protein top-up!" },
      { name: "Hummus & Carrots", emoji: "🥕", protein: 6, carbs: 18, fat: 10, calories: 180, reason: "Crunchy and balanced!" },
      { name: "Greek Yogurt", emoji: "🥛", protein: 17, carbs: 12, fat: 0, calories: 120, reason: "Light protein snack!" },
      { name: "Trail Mix", emoji: "🌰", protein: 8, carbs: 20, fat: 16, calories: 240, reason: "Energy-packed snack!" },
    ];

    if (timeOfDay === "snack") {
      // Smart snack selection based on what's needed most
      if (isHighProteinNeeded) {
        return snacks.find(s => s.protein > 15) || snacks[2];
      }
      if (isHighFatNeeded) {
        return snacks.find(s => s.fat > 12) || snacks[0];
      }
      if (isHighCarbsNeeded) {
        return snacks.find(s => s.carbs > 15) || snacks[1];
      }
      // Random snack if balanced
      return snacks[Math.floor(Math.random() * snacks.length)];
    } else {
      // Meal selection based on time and needs
      const mealOptions = meals[timeOfDay];
      if (isHighProteinNeeded) {
        return mealOptions.find(m => m.protein > 25) || mealOptions[0];
      }
      return mealOptions[Math.floor(Math.random() * mealOptions.length)];
    }
  };

  const suggestion = getSuggestion();

  const handleLogFood = async () => {
    if (!suggestion) return;
    setIsLogging(true);
    await onLogFood({
      name: suggestion.name,
      calories: suggestion.calories,
      protein: suggestion.protein,
      carbs: suggestion.carbs,
      fat: suggestion.fat,
    });
    setTimeout(() => setIsLogging(false), 600);
  };

  // Balance reminder if over goal
  if (caloriesRemaining < 0) {
    return (
      <section className="relative space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground px-2">Ottr's Pick for You 🦦</h2>
        <div className="relative p-6 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-orange-500/5 via-primary/5 to-purple-500/5 overflow-hidden">
          <div className="absolute top-2 right-2 w-12 h-12">
            <OtterMascot mood="encouraging" animate={true} />
          </div>
          <div className="space-y-2 pr-12">
            <h3 className="text-base font-semibold text-foreground">Balance Reminder</h3>
            <p className="text-sm text-muted-foreground">
              You've fueled up well today! Maybe try a light walk or water break 💧
            </p>
          </div>
        </div>
      </section>
    );
  }

  // No suggestion available
  if (!suggestion) {
    return (
      <section className="relative space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground px-2">Ottr's Pick for You 🦦</h2>
        <div className="relative p-6 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-orange-500/5 via-primary/5 to-purple-500/5">
          <div className="absolute top-2 right-2 w-12 h-12">
            <OtterMascot mood="sleepy" animate={true} />
          </div>
          <p className="text-sm text-muted-foreground pr-12">
            Ottr's still thinking about your next snack… 💤
          </p>
        </div>
      </section>
    );
  }

  // Show suggestion
  return (
    <section className="relative space-y-3 animate-fade-in">
      <h2 className="text-sm font-medium text-muted-foreground px-2">Ottr's Pick for You 🦦</h2>
      <div 
        className={cn(
          "relative p-6 rounded-2xl border-2 border-primary/20 overflow-hidden transition-all duration-300",
          "bg-gradient-to-br from-orange-500/10 via-primary/10 to-purple-500/10",
          "animate-[shimmer_3s_ease-in-out_infinite]"
        )}
      >
        {/* Shimmer effect */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            animation: "shimmer-slide 3s ease-in-out infinite",
          }}
        />

        {/* Ottr mascot */}
        <div className={cn(
          "absolute top-2 right-2 w-12 h-12 transition-transform duration-300",
          isLogging && "animate-bounce"
        )}>
          <OtterMascot mood="happy" animate={true} />
        </div>

        <div className="space-y-4 pr-14">
          {/* Suggestion header */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="text-2xl">{suggestion.emoji}</span>
              {suggestion.name}
            </h3>
          </div>

          {/* Macros breakdown */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="font-medium text-primary">P:</span>
              <span className="text-muted-foreground">{suggestion.protein}g</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-orange-500">C:</span>
              <span className="text-muted-foreground">{suggestion.carbs}g</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-yellow-500">F:</span>
              <span className="text-muted-foreground">{suggestion.fat}g</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-foreground">Cal:</span>
              <span className="text-muted-foreground">{suggestion.calories}</span>
            </div>
          </div>

          {/* Log button */}
          <button
            onClick={handleLogFood}
            disabled={isLogging}
            className={cn(
              "w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200",
              "bg-gradient-to-r from-orange-500/90 to-primary/90 text-white",
              "hover:from-orange-500 hover:to-primary",
              "active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLogging ? "Logging..." : "Log this"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shimmer-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
};
