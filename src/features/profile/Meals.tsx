import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingNavbar } from '@/components/Navbar';

type Period = 'Morning' | 'Afternoon' | 'Evening';

interface Meal {
  id: string;
  period: Period;
  time: string;
  name: string;
  calories: number;
  macros: { p: number; c: number; f: number };
  tag: string;
}

const dailyMeals: Meal[] = [
  { id: '1', period: 'Morning', time: '07:30', name: "Oatmeal & Whey", calories: 450, macros: { p: 30, c: 60, f: 8 }, tag: "Energy" },
  { id: '2', period: 'Afternoon', time: '12:30', name: "Chicken & Rice", calories: 620, macros: { p: 55, c: 70, f: 12 }, tag: "Recovery" },
  { id: '3', period: 'Afternoon', time: '16:00', name: "Greek Yogurt", calories: 150, macros: { p: 15, c: 8, f: 0 }, tag: "Snack" },
  { id: '4', period: 'Evening', time: '19:30', name: "Salmon Salad", calories: 380, macros: { p: 40, c: 10, f: 20 }, tag: "Light" },
];

export default function CompactMealTracker() {
  const [completed, setCompleted] = useState<string[]>([]);

  const toggleMeal = (id: string) => {
    setCompleted((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const totalCals = dailyMeals.reduce((acc, curr) => acc + curr.calories, 0);
  const consumedCals = dailyMeals
    .filter(m => completed.includes(m.id))
    .reduce((acc, curr) => acc + curr.calories, 0);
  
  const progressPercentage = Math.round((consumedCals / totalCals) * 100);
  const allDone = completed.length === dailyMeals.length;

  const periods: Period[] = ['Morning', 'Afternoon', 'Evening'];

  return (
    <div className="w-full min-h-screen mt-4 bg-background text-foreground flex flex-col font-sans">
      <OnboardingNavbar/>
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border/40 px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold tracking-tight">Today's Fuel</h1>
            <p className="text-xs text-muted-foreground font-medium">
              {consumedCals} / {totalCals} kcal
            </p>
          </div>
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-500 border shadow-sm",
            allDone 
              ? "bg-primary text-primary-foreground border-primary" 
              : "bg-muted text-muted-foreground border-border"
          )}>
            {allDone ? <Trophy className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
          </div>
        </div>
        <Progress value={progressPercentage} className="h-1.5 w-full" />
      </div>

      {/* List Container */}
      <div className="flex-1 w-full p-4 space-y-6 pb-10">
        {periods.map((period) => {
          const mealsInPeriod = dailyMeals.filter(m => m.period === period);
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
                      <div className={cn(
                        "h-5 w-5 rounded-full border flex items-center justify-center transition-colors duration-200 shrink-0",
                        isChecked 
                          ? "bg-primary border-primary" 
                          : "bg-background border-input group-hover:border-primary"
                      )}>
                        {isChecked && <Check className="w-3 h-3 text-primary-foreground stroke-[3px]" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn(
                            "text-sm font-semibold truncate pr-2 transition-all",
                            isChecked && "text-muted-foreground line-through decoration-muted-foreground/50"
                          )}>
                            {meal.name}
                          </span>
                          <span className={cn(
                            "text-xs font-mono font-medium",
                            isChecked ? "text-muted-foreground" : "text-foreground"
                          )}>
                            {meal.calories}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="font-medium text-foreground/80">{meal.time}</span>
                          <span className="text-muted-foreground/40">•</span>
                          <span className="tracking-wide text-xs">{meal.macros.p}p {meal.macros.c}c {meal.macros.f}f</span>
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