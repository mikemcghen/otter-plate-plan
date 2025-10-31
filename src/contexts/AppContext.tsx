import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface FoodLog {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: Date;
}

interface AppState {
  // User stats
  caloriesConsumed: number;
  caloriesTarget: number;
  proteinConsumed: number;
  proteinTarget: number;
  carbsConsumed: number;
  carbsTarget: number;
  fatConsumed: number;
  fatTarget: number;
  waterConsumed: number;
  waterTarget: number;
  
  // Gamification
  xp: number;
  level: number;
  streak: number;
  
  // Food logs
  foodLogs: FoodLog[];
  
  // Last activity
  lastLogDate: string;
  lastWaterLog?: Date;
}

interface AppContextType extends AppState {
  logFood: (food: Omit<FoodLog, "id" | "timestamp">) => void;
  logWater: (amount: number) => void;
  undoLastWater: () => void;
  resetDailyStats: () => void;
  getXPForNextLevel: () => number;
  getCaloriesRemaining: () => number;
  checkAndUpdateStreak: () => void;
  awardXP: (amount: number, reason?: string) => number; // Returns new total XP
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const XP_PER_LEVEL = 100;
const XP_PER_FOOD_LOG = 15;
const XP_PER_PERFECT_DAY = 50;

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(() => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem("ottrcal_app_state");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        foodLogs: parsed.foodLogs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        })),
      };
    }
    
    return {
      caloriesConsumed: 0,
      caloriesTarget: 2000,
      proteinConsumed: 0,
      proteinTarget: 120,
      carbsConsumed: 0,
      carbsTarget: 200,
      fatConsumed: 0,
      fatTarget: 60,
      waterConsumed: 0,
      waterTarget: 2000, // 2 liters in ml
      xp: 0,
      level: 1,
      streak: 0,
      foodLogs: [],
      lastLogDate: new Date().toDateString(),
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("ottrcal_app_state", JSON.stringify(state));
  }, [state]);

  // Check streak on mount
  useEffect(() => {
    checkAndUpdateStreak();
  }, []);

  const checkAndUpdateStreak = () => {
    const today = new Date().toDateString();
    const lastLog = state.lastLogDate;
    
    if (!lastLog) {
      setState(prev => ({ ...prev, lastLogDate: today }));
      return;
    }

    const lastLogDate = new Date(lastLog);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastLogDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day, no change
      return;
    } else if (diffDays === 1) {
      // Next day, increment streak
      setState(prev => ({
        ...prev,
        streak: prev.streak + 1,
        lastLogDate: today,
      }));
    } else if (diffDays > 1) {
      // Missed days, reset streak but be gentle
      setState(prev => ({
        ...prev,
        streak: 1,
        lastLogDate: today,
      }));
    }
  };

  const logFood = (food: Omit<FoodLog, "id" | "timestamp">) => {
    const newLog: FoodLog = {
      ...food,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    setState((prev) => {
      const newCalories = prev.caloriesConsumed + food.calories;
      const newProtein = prev.proteinConsumed + food.protein;
      const newCarbs = prev.carbsConsumed + food.carbs;
      const newFat = prev.fatConsumed + food.fat;
      
      let newXP = prev.xp + XP_PER_FOOD_LOG;
      let newLevel = prev.level;
      
      // Check if perfect day (95-105% of target)
      const percentage = (newCalories / prev.caloriesTarget) * 100;
      if (percentage >= 95 && percentage <= 105 && prev.foodLogs.length >= 2) {
        newXP += XP_PER_PERFECT_DAY;
      }
      
      // Check for level up
      const xpNeeded = newLevel * XP_PER_LEVEL;
      if (newXP >= xpNeeded) {
        newLevel += 1;
        newXP = newXP - xpNeeded;
      }

      return {
        ...prev,
        caloriesConsumed: newCalories,
        proteinConsumed: newProtein,
        carbsConsumed: newCarbs,
        fatConsumed: newFat,
        xp: newXP,
        level: newLevel,
        foodLogs: [...prev.foodLogs, newLog],
        lastLogDate: new Date().toDateString(),
      };
    });

    // Update streak
    checkAndUpdateStreak();
  };

  const logWater = (amount: number) => {
    setState((prev) => ({
      ...prev,
      waterConsumed: Math.min(prev.waterConsumed + amount, prev.waterTarget * 1.5),
      lastWaterLog: new Date(),
    }));
    
    // Award XP for water logging
    awardXP(5, "water_log");
  };

  const undoLastWater = () => {
    setState((prev) => {
      // Simple undo: reduce by 250ml (1 cup)
      const newAmount = Math.max(0, prev.waterConsumed - 250);
      return {
        ...prev,
        waterConsumed: newAmount,
      };
    });
  };

  const resetDailyStats = () => {
    setState((prev) => ({
      ...prev,
      caloriesConsumed: 0,
      proteinConsumed: 0,
      carbsConsumed: 0,
      fatConsumed: 0,
      waterConsumed: 0,
      foodLogs: [],
    }));
  };

  const getXPForNextLevel = () => {
    return state.level * XP_PER_LEVEL;
  };

  const getCaloriesRemaining = () => {
    return Math.max(0, state.caloriesTarget - state.caloriesConsumed);
  };

  const awardXP = (amount: number, reason?: string): number => {
    let newXP = state.xp + amount;
    let newLevel = state.level;
    
    // Check for level up
    const xpNeeded = newLevel * XP_PER_LEVEL;
    if (newXP >= xpNeeded) {
      newLevel += 1;
      newXP = newXP - xpNeeded;
      
      // Could trigger level up modal here
      console.log(`Level up! Now level ${newLevel}`);
    }
    
    setState((prev) => ({
      ...prev,
      xp: newXP,
      level: newLevel,
    }));
    
    return newXP;
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        logFood,
        logWater,
        undoLastWater,
        resetDailyStats,
        getXPForNextLevel,
        getCaloriesRemaining,
        checkAndUpdateStreak,
        awardXP,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
