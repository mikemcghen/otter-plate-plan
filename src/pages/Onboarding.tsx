import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Scale, TrendingUp, TrendingDown, User, Footprints, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OtterMascot } from "@/components/OtterMascot";
import { Confetti } from "@/components/Confetti";
import { useHaptics } from "@/hooks/useHaptics";

const Onboarding = () => {
  const navigate = useNavigate();
  const { impact, notification } = useHaptics();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const goals = [
    { id: "maintain", label: "Maintain", icon: Scale },
    { id: "gain", label: "Gain Slightly", icon: TrendingUp },
    { id: "lose", label: "Lose Slightly", icon: TrendingDown },
  ];

  const activityLevels = [
    { id: "light", label: "Lightly Active", icon: User },
    { id: "moderate", label: "Moderately Active", icon: Footprints },
    { id: "very", label: "Very Active", icon: Zap },
  ];

  const handleNext = async () => {
    await impact();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = async () => {
    await notification("success");
    setShowConfetti(true);
    
    // Store onboarding completion
    localStorage.setItem("ottrcal_onboarding_complete", "true");
    localStorage.setItem("ottrcal_user_goal", selectedGoal || "maintain");
    localStorage.setItem("ottrcal_user_activity", selectedActivity || "moderate");
    
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const steps = [
    // Step 0: Welcome
    <div key="welcome" className="flex flex-col items-center justify-center min-h-[70vh] px-6 animate-fade-in">
      <OtterMascot mood="happy" animate={true} className="mb-8" />
      <h1 className="text-3xl font-bold text-foreground text-center mb-4">
        Hi, I'm Ottr!
      </h1>
      <p className="text-lg text-muted-foreground text-center max-w-sm mb-8">
        Your friendly snack coach. I'll help you maintain a healthy weight through positive tracking — no dieting, just balance!
      </p>
    </div>,

    // Step 1: Goal Selection
    <div key="goal" className="flex flex-col items-center justify-center min-h-[70vh] px-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-foreground text-center mb-3">
        What's your goal?
      </h2>
      <p className="text-base text-muted-foreground text-center mb-8">
        Choose what feels right for you
      </p>
      <div className="w-full max-w-sm space-y-3">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={async () => {
              await impact();
              setSelectedGoal(goal.id);
            }}
            className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
              selectedGoal === goal.id
                ? "bg-primary border-primary text-primary-foreground shadow-lg scale-105"
                : "bg-card border-border text-foreground hover:border-primary/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <goal.icon className="w-6 h-6" />
              <span className="text-lg font-semibold">{goal.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Activity Level
    <div key="activity" className="flex flex-col items-center justify-center min-h-[70vh] px-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-foreground text-center mb-3">
        How active are you?
      </h2>
      <p className="text-base text-muted-foreground text-center mb-8">
        This helps us suggest the right amount
      </p>
      <div className="w-full max-w-sm space-y-3">
        {activityLevels.map((level) => (
          <button
            key={level.id}
            onClick={async () => {
              await impact();
              setSelectedActivity(level.id);
            }}
            className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
              selectedActivity === level.id
                ? "bg-primary border-primary text-primary-foreground shadow-lg scale-105"
                : "bg-card border-border text-foreground hover:border-primary/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <level.icon className="w-6 h-6" />
              <span className="text-lg font-semibold">{level.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>,

    // Step 3: Completion
    <div key="complete" className="flex flex-col items-center justify-center min-h-[70vh] px-6 animate-fade-in">
      <OtterMascot mood="proud" animate={true} className="mb-8" />
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        <h2 className="text-3xl font-bold text-foreground text-center">
          You're all set!
        </h2>
        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
      </div>
      <p className="text-lg text-muted-foreground text-center max-w-sm mb-4">
        Let's start your healthy journey together
      </p>
      <div className="bg-primary/10 rounded-2xl p-6 max-w-sm space-y-2">
        <div className="flex items-center justify-center gap-2">
          {goals.find(g => g.id === selectedGoal)?.icon && (
            React.createElement(goals.find(g => g.id === selectedGoal)!.icon, { className: "w-4 h-4 text-primary" })
          )}
          <p className="text-sm text-foreground font-medium">
            Goal: {goals.find(g => g.id === selectedGoal)?.label}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          {activityLevels.find(a => a.id === selectedActivity)?.icon && (
            React.createElement(activityLevels.find(a => a.id === selectedActivity)!.icon, { className: "w-4 h-4 text-primary" })
          )}
          <p className="text-sm text-foreground font-medium">
            Activity: {activityLevels.find(a => a.id === selectedActivity)?.label}
          </p>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 flex flex-col">
      <Confetti active={showConfetti} />
      
      {/* Progress Dots */}
      <div className="pt-8 pb-4 flex justify-center gap-2">
        {[0, 1, 2, 3].map((step) => (
          <div
            key={step}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentStep === step
                ? "w-8 bg-primary"
                : currentStep > step
                ? "w-2 bg-primary/50"
                : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {steps[currentStep]}
      </div>

      {/* Navigation */}
      <div className="p-6 pb-8">
        {currentStep < 3 ? (
          <Button
            size="lg"
            className="w-full h-14 text-lg rounded-2xl active:scale-95 transition-transform"
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !selectedGoal) ||
              (currentStep === 2 && !selectedActivity)
            }
          >
            {currentStep === 0 ? "Let's Go!" : "Continue"}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full h-14 text-lg rounded-2xl active:scale-95 transition-transform"
            onClick={handleComplete}
          >
            Start Tracking
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
