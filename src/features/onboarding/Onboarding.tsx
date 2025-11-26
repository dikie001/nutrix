import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Icons from lucide-react (standard for Shadcn/Radix components)
import { ChevronRight, Dumbbell, Zap, TrendingUp, Sun, Flame } from "lucide-react";

// --- Types ---
type ActivityLevel = "light" | "moderate" | "elite";
type Goal = "maintain" | "gain" | "loss";

interface ActivityGoalsScreenProps {
  onNext: () => void;
  onActivityChange: (level: ActivityLevel) => void;
  onGoalChange: (goal: Goal) => void;
  currentActivity: ActivityLevel | null;
  currentGoal: Goal | null;
}

// --- Component ---
const Onboarding: React.FC<ActivityGoalsScreenProps> = ({
  onNext,
  onActivityChange,
  onGoalChange,
  currentActivity,
  currentGoal,
}) => {

  const isFormComplete = currentActivity !== null && currentGoal !== null;

  return (
    <div className="flex flex-col space-y-6 p-4 max-w-lg mx-auto">
      {/* Progress Bar (from Screen 2) */}
      <Progress value={60} className="w-full h-2" />

      {/* Activity Level Selection */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle>Activity Level</CardTitle>
          <CardDescription>How intense is your training? (TDEE Multiplier)</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ToggleGroup
            type="single"
            value={currentActivity || ""}
            onValueChange={(value: string) => onActivityChange(value as ActivityLevel)}
            className="grid grid-cols-3 gap-2 w-full"
          >
            <ToggleGroupItem value="light" aria-label="Light Activity" className="flex flex-col h-24 p-2">
              <Sun className="h-6 w-6 text-yellow-500" />
              <span className="mt-1 text-sm font-medium">Light</span>
              <span className="text-xs text-muted-foreground">Casual</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="moderate" aria-label="Moderate Activity" className="flex flex-col h-24 p-2">
              <Dumbbell className="h-6 w-6 text-green-500" />
              <span className="mt-1 text-sm font-medium">Moderate</span>
              <span className="text-xs text-muted-foreground">3-4x/week</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="elite" aria-label="Elite Activity" className="flex flex-col h-24 p-2">
              <Zap className="h-6 w-6 text-red-500" />
              <span className="mt-1 text-sm font-medium">Elite</span>
              <span className="text-xs text-muted-foreground">Daily Training</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      <Separator />

      {/* Goals Selection */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle>Your Goal</CardTitle>
          <CardDescription>What is your primary objective? (Macro Adjustment)</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ToggleGroup
            type="single"
            value={currentGoal || ""}
            onValueChange={(value: string) => onGoalChange(value as Goal)}
            className="grid grid-cols-3 gap-2 w-full"
          >
            <ToggleGroupItem value="maintain" aria-label="Maintain Weight" className="flex flex-col h-24 p-2">
              <TrendingUp className="h-6 w-6 text-blue-500" />
              <span className="mt-1 text-sm font-medium">Maintain</span>
              <span className="text-xs text-muted-foreground">Balance</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="gain" aria-label="Muscle Gain" className="flex flex-col h-24 p-2">
              <Dumbbell className="h-6 w-6 text-amber-500" />
              <span className="mt-1 text-sm font-medium">Gain Muscle</span>
              <span className="text-xs text-muted-foreground">Protein focus</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="loss" aria-label="Fat Loss" className="flex flex-col h-24 p-2">
              <Flame className="h-6 w-6 text-pink-500" />
              <span className="mt-1 text-sm font-medium">Lose Fat</span>
              <span className="text-xs text-muted-foreground">Deficit focus</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      {/* Navigation Button */}
      <Button 
        onClick={onNext} 
        disabled={!isFormComplete}
        className="w-full"
      >
        Continue to Preferences
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default Onboarding;