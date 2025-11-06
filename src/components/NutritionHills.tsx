interface NutritionHillsProps {
  protein: { current: number; target: number };
  carbs: { current: number; target: number };
  fats: { current: number; target: number };
}

export const NutritionHills = ({ protein, carbs, fats }: NutritionHillsProps) => {
  const proteinPercent = Math.min((protein.current / protein.target) * 100, 100);
  const carbsPercent = Math.min((carbs.current / carbs.target) * 100, 100);
  const fatsPercent = Math.min((fats.current / fats.target) * 100, 100);

  const hills = [
    { label: "Protein", percent: proteinPercent, color: "from-[#FCA5A5] to-[#FCA5A5]/60", current: protein.current, target: protein.target },
    { label: "Carbs", percent: carbsPercent, color: "from-[#C4B5FD] to-[#C4B5FD]/60", current: carbs.current, target: carbs.target },
    { label: "Fats", percent: fatsPercent, color: "from-[#2DD4BF] to-[#2DD4BF]/60", current: fats.current, target: fats.target },
  ];

  return (
    <div className="w-full space-y-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Nutrition Hills</h3>
      
      <div className="flex items-end justify-around gap-4 h-32">
        {hills.map((hill, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            {/* Hill shape */}
            <div className="relative w-full h-24 flex items-end">
              <div
                className={`w-full bg-gradient-to-t ${hill.color} rounded-t-full transition-all duration-700 ease-out`}
                style={{ height: `${hill.percent}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent rounded-t-full animate-breathing" />
              </div>
            </div>
            
            {/* Label */}
            <div className="text-center">
              <p className="text-xs font-medium text-foreground">{hill.label}</p>
              <p className="text-[10px] text-muted-foreground">{hill.current}g / {hill.target}g</p>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-center text-muted-foreground italic mt-3">
        Rolling hills of balanced nutrition
      </p>
    </div>
  );
};
