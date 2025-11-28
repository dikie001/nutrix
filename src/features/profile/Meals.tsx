import { OnboardingNavbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { food as foodDatabase } from "@/data/food";
import { USER_DATA } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check, Flame, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

type Period = "Morning" | "Afternoon" | "Evening";

interface FoodItem {
  id: number;
  name: string;
  type: string;
  servingGrams: number;
  calories: number;
  protein: number;
  fat: number;
  useCase: string;
  athleteBenefit: string;
}

interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: string;
  trainingDays: string;
  intensity: string;
  goal: string;
}

interface Meal {
  id: string;
  period: Period;
  time: string;
  name: string;
  calories: number;
  macros: { p: number; c: number; f: number };
  tag: string;
}

export default function CompactMealTracker() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [dailyMeals, setDailyMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [targets, setTargets] = useState({ cals: 0, p: 0 });

  useEffect(() => {
    const generatePlan = () => {
      // 1. Safety Check: Database
      if (
        !foodDatabase ||
        !Array.isArray(foodDatabase) ||
        foodDatabase.length === 0
      ) {
        console.error("Food database is missing or empty.");
        setLoading(false);
        return;
      }

      // 2. Fetch and Parse LocalStorage
      const storedData = localStorage.getItem(USER_DATA);
      if (!storedData) {
        setLoading(false);
        return;
      }

      let profile: UserProfile;
      try {
        profile = JSON.parse(storedData);
      } catch (e) {
        console.error("Failed to parse user profile", e);
        setLoading(false);
        return;
      }

      // 3. Calculate TDEE (Safe Access)
      const isMale = profile?.gender?.toLowerCase() === "female" ? false : true;
      const weight = Number(profile.weight) || 70;
      const height = Number(profile.height) || 170;
      const age = Number(profile.age) || 25;

      const bmr = 10 * weight + 6.25 * height - 5 * age + (isMale ? 5 : -161);

      // Activity Multiplier
      const days = parseInt(profile.trainingDays || "3") || 3;
      const activityMultiplier =
        1.2 + days * 0.05 + (profile.intensity === "high" ? 0.1 : 0);

      let targetCalories = Math.round(bmr * activityMultiplier);

      // Goal Adjustment
      if (profile.goal === "gain") targetCalories += 400;
      else if (profile.goal === "lose") targetCalories -= 400;

      setTargets({ cals: targetCalories, p: Math.round(weight * 2) });

      // 4. Generate Meals
      const generatedMeals: Meal[] = [];

      const getMacros = (f: FoodItem) => {
        const c = Math.max(
          0,
          Math.round((f.calories - (f.protein * 4 + f.fat * 9)) / 4)
        );
        return { p: f.protein, c, f: f.fat };
      };

      // Fallback to first item if specific search fails, but ensure first item exists
      const fallback = foodDatabase[0];

      const morningFood =
        foodDatabase.find(
          (f) => f.type as string  === "energy"
        ) || fallback;
      const lunchProtein =
        foodDatabase.find(
          (f) => f.useCase === "recovery" && f.type === "protein"
        ) || fallback;
      // Cast f.type to string to allow the comparison
      const snackFood =
        foodDatabase.find(
          (f) => (f.type as string) === "fruit" || f.calories < 200
        ) || fallback;
      const dinnerFood =
        foodDatabase.find((f) => f.type === "protein" && f.fat < 10) ||
        fallback;

      // Only push if food item is defined
      if (morningFood) {
        generatedMeals.push({
          id: "1",
          period: "Morning",
          time: "07:30",
          name: morningFood.name,
          calories: morningFood.calories,
          macros: getMacros(morningFood),
          tag: "Energy",
        });
      }
      if (lunchProtein) {
        generatedMeals.push({
          id: "2",
          period: "Afternoon",
          time: "12:30",
          name: lunchProtein.name,
          calories: lunchProtein.calories,
          macros: getMacros(lunchProtein),
          tag: "Recovery",
        });
      }
      if (snackFood) {
        generatedMeals.push({
          id: "3",
          period: "Afternoon",
          time: "16:00",
          name: snackFood.name,
          calories: snackFood.calories,
          macros: getMacros(snackFood),
          tag: "Snack",
        });
      }
      if (dinnerFood) {
        generatedMeals.push({
          id: "4",
          period: "Evening",
          time: "19:30",
          name: dinnerFood.name,
          calories: dinnerFood.calories,
          macros: getMacros(dinnerFood),
          tag: "Light",
        });
      }

      setDailyMeals(generatedMeals);
      setLoading(false);
    };

    generatePlan();
  }, []);

  const toggleMeal = (id: string) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const totalCals = dailyMeals.reduce((acc, curr) => acc + curr.calories, 0);
  const consumedCals = dailyMeals
    .filter((m) => completed.includes(m.id))
    .reduce((acc, curr) => acc + curr.calories, 0);

  const progressPercentage =
    totalCals > 0 ? Math.round((consumedCals / totalCals) * 100) : 0;
  const allDone =
    dailyMeals.length > 0 && completed.length === dailyMeals.length;

  const periods: Period[] = ["Morning", "Afternoon", "Evening"];

  if (loading)
    return (
      <div className="p-10 text-center text-muted-foreground">
        Generating Plan...
      </div>
    );

  return (
    <div className="w-full min-h-screen mt-4 bg-background text-foreground flex flex-col font-sans">
      <OnboardingNavbar
        currentLang="en"
        onLanguageChange={() => alert("Change language")}
      />

      {/* Sticky Header */}
      <div className="sticky top-0 z-20 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold tracking-tight">Today's Fuel</h1>
            <div className="flex gap-2 text-xs text-muted-foreground font-medium">
              <span>
                {consumedCals} / {targets.cals > 0 ? targets.cals : totalCals}{" "}
                kcal target
              </span>
            </div>
          </div>
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-500 border shadow-sm",
              allDone
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border"
            )}
          >
            {allDone ? (
              <Trophy className="w-4 h-4" />
            ) : (
              <Flame className="w-4 h-4" />
            )}
          </div>
        </div>
        <Progress value={progressPercentage} className="h-1.5 w-full" />
      </div>

      {/* List Container */}
      <div className="flex-1 w-full p-4 space-y-6 pb-10">
        {periods.map((period) => {
          const mealsInPeriod = dailyMeals.filter((m) => m.period === period);
          if (mealsInPeriod.length === 0) return null;

          return (
            <div key={period} className="space-y-3">
              <h2 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground pl-1">
                {period}
              </h2>

              <div className="space-y-2.5">
                {mealsInPeriod.map((meal) => {
                  const isChecked = completed.includes(meal.id);

                  return (
                    <div
                      key={meal.id}
                      onClick={() => toggleMeal(meal.id)}
                      className={cn(
                        "group relative flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none overflow-hidden w-full",
                        isChecked
                          ? "bg-muted/40 border-border/50 opacity-60"
                          : "bg-card border-border shadow-sm hover:border-primary/40 active:scale-[0.99]"
                      )}
                    >
                      {/* Check Circle */}
                      <div
                        className={cn(
                          "h-5 w-5 rounded-full border flex items-center justify-center transition-colors duration-200 shrink-0",
                          isChecked
                            ? "bg-primary border-primary"
                            : "bg-background border-input group-hover:border-primary"
                        )}
                      >
                        {isChecked && (
                          <Check className="w-3 h-3 text-primary-foreground stroke-[3px]" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={cn(
                              "text-sm font-semibold truncate pr-2 transition-all",
                              isChecked &&
                                "text-muted-foreground line-through decoration-muted-foreground/50"
                            )}
                          >
                            {meal.name}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-mono font-medium",
                              isChecked
                                ? "text-muted-foreground"
                                : "text-foreground"
                            )}
                          >
                            {meal.calories}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="font-medium text-foreground/80">
                            {meal.time}
                          </span>
                          <span className="text-muted-foreground/40">•</span>
                          <span className="tracking-wide text-xs">
                            {meal.macros.p}p {meal.macros.c}c {meal.macros.f}f
                          </span>
                        </div>
                      </div>

                      {/* Tag */}
                      {!isChecked && (
                        <Badge
                          variant="secondary"
                          className="hidden sm:flex text-[9px] px-1.5 h-5 font-medium bg-secondary text-secondary-foreground shadow-none ml-1"
                        >
                          {meal.tag}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
