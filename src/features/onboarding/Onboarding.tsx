import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell, Utensils, Activity, ChevronLeft, ChevronRight, Trophy } from "lucide-react";

// --- Types ---
type OnboardingData = {
  sport: string;
  age: number;
  weight: number;
  height: number;
  trainingDays: string;
  intensity: 'low' | 'moderate' | 'high';
  foods: string[];
  goal: string;
};

const KENYAN_FOODS = [
  { id: 'ugali', label: 'Ugali' },
  { id: 'sukuma', label: 'Sukuma Wiki' },
  { id: 'omena', label: 'Omena' },
  { id: 'nyama', label: 'Nyama Choma' },
  { id: 'mursik', label: 'Mursik' },
  { id: 'ngwaci', label: 'Sweet Potato (Ngwaci)' },
  { id: 'githeri', label: 'Githeri' },
];

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const [formData, setFormData] = useState<OnboardingData>({
    sport: '',
    age: 25,
    weight: 60,
    height: 170,
    trainingDays: '3',
    intensity: 'moderate',
    foods: [],
    goal: ''
  });

  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateField = (field: keyof OnboardingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFood = (foodId: string) => {
    setFormData((prev) => {
      const foods = prev.foods.includes(foodId)
        ? prev.foods.filter((f) => f !== foodId)
        : [...prev.foods, foodId];
      return { ...prev, foods };
    });
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-background text-foreground p-4">
      {/* Header & Progress */}
      <div className="mb-8 space-y-4 pt-4">
        <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 overflow-y-auto pb-20">
        
        {/* Step 1: Sport Profile */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your Discipline</h2>
              <p className="text-muted-foreground">This defines your carb/protein ratios.</p>
            </div>
            <RadioGroup 
              value={formData.sport} 
              onValueChange={(val) => updateField('sport', val)} 
              className="grid grid-cols-1 gap-4"
            >
              {[
                { val: 'run_long', label: 'Long Distance', icon: '🏃🏿‍♂️' },
                { val: 'sprints', label: 'Sprints', icon: '⚡' },
                { val: 'rugby', label: 'Rugby 7s / 15s', icon: '🏉' },
                { val: 'football', label: 'Football', icon: '⚽' },
              ].map((sport) => (
                <div key={sport.val}>
                  <RadioGroupItem value={sport.val} id={sport.val} className="peer sr-only" />
                  <Label
                    htmlFor={sport.val}
                    className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                  >
                    <span className="font-semibold text-lg">{sport.label}</span>
                    <span className="text-2xl">{sport.icon}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Biometrics */}
        {step === 2 && (
          <div className="space-y-8">
             <div>
              <h2 className="text-2xl font-bold tracking-tight">The Engine</h2>
              <p className="text-muted-foreground">Calibrating your energy expenditure.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <Label>Weight</Label>
                <span className="text-2xl font-bold font-mono">{formData.weight} <span className="text-sm text-muted-foreground">kg</span></span>
              </div>
              <Slider 
                value={[formData.weight]} 
                min={40} max={120} step={1} 
                onValueChange={(val) => updateField('weight', val[0])} 
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <Label>Height</Label>
                <span className="text-2xl font-bold font-mono">{formData.height} <span className="text-sm text-muted-foreground">cm</span></span>
              </div>
              <Slider 
                value={[formData.height]} 
                min={140} max={210} step={1} 
                onValueChange={(val) => updateField('height', val[0])} 
              />
            </div>

             <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  value={formData.age} 
                  onChange={(e) => updateField('age', parseInt(e.target.value))}
                  className="text-lg py-6"
                />
            </div>
          </div>
        )}

        {/* Step 3: Intensity */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Training Load</h2>
              <p className="text-muted-foreground">How much fuel do you burn?</p>
            </div>

            <div className="space-y-2">
                <Label>Weekly Sessions</Label>
                <Select onValueChange={(val) => updateField('trainingDays', val)} defaultValue={formData.trainingDays}>
                  <SelectTrigger className="w-full py-6 text-lg">
                    <SelectValue placeholder="Select days" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num} Days / Week</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>

            <div className="space-y-3 pt-4">
                <Label>Session Intensity</Label>
                <Tabs defaultValue="moderate" onValueChange={(val) => updateField('intensity', val)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-12">
                        <TabsTrigger value="low">Low</TabsTrigger>
                        <TabsTrigger value="moderate">Mod</TabsTrigger>
                        <TabsTrigger value="high">High</TabsTrigger>
                    </TabsList>
                </Tabs>
                <p className="text-xs text-muted-foreground mt-2">
                    {formData.intensity === 'high' ? 'Includes altitude training & competition pace.' : 'Standard aerobic or recovery sessions.'}
                </p>
            </div>
          </div>
        )}

        {/* Step 4: Local Diet */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your Fuel</h2>
              <p className="text-muted-foreground">Select your regular staples.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {KENYAN_FOODS.map((food) => (
                <div key={food.id} className="flex items-center space-x-3 border p-4 rounded-lg active:bg-accent/50 transition-colors">
                  <Checkbox 
                    id={food.id} 
                    checked={formData.foods.includes(food.id)}
                    onCheckedChange={() => toggleFood(food.id)}
                  />
                  <Label htmlFor={food.id} className="text-base flex-1 cursor-pointer font-medium">
                    {food.label}
                  </Label>
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Goal */}
        {step === 5 && (
            <div className="space-y-6">
                 <div>
                    <h2 className="text-2xl font-bold tracking-tight">Current Goal</h2>
                    <p className="text-muted-foreground">We'll adjust portions accordingly.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {[
                        { id: 'cut', title: 'Lean Out', desc: 'Maintain muscle, drop fat.' },
                        { id: 'maintain', title: 'Maintain', desc: 'Peak performance weight.' },
                        { id: 'bulk', title: 'Build Strength', desc: 'Caloric surplus for size.' },
                        { id: 'race', title: 'Race Prep', desc: 'Carbo-loading phase.' },
                    ].map((goal) => (
                        <Card 
                            key={goal.id} 
                            className={`cursor-pointer transition-all ${formData.goal === goal.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-accent'}`}
                            onClick={() => updateField('goal', goal.id)}
                        >
                            <CardContent className="flex items-center p-4 gap-4">
                                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                    <Trophy className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{goal.title}</h3>
                                    <p className="text-sm text-muted-foreground">{goal.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t flex gap-4 max-w-md mx-auto">
        <Button 
            variant="ghost" 
            className="flex-1" 
            onClick={handleBack}
            disabled={step === 1}
        >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
            className="flex-1" 
            onClick={handleNext}
        >
            {step === totalSteps ? 'Generate Plan' : 'Next'} 
            {step !== totalSteps && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}