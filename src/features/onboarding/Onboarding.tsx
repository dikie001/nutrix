import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Trophy, Utensils } from "lucide-react";
import { useState } from "react";

// --- Types ---
type OnboardingData = {
  sport: string;
  age: number;
  weight: number;
  height: number;
  trainingDays: string;
  intensity: "low" | "moderate" | "high";
  foods: string[];
  goal: string;
};

const KENYAN_FOODS = [
  { id: "ugali", label: "Ugali" },
  { id: "sukuma", label: "Sukuma Wiki" },
  { id: "chapati", label: "Chapati" },
  { id: "beans", label: "Beans" },
  { id: "omena", label: "Omena" },
  { id: "nyama", label: "Nyama Choma" },
  { id: "eggs", label: "Eggs" },
  { id: "milk", label: "Milk/Mursik" },
  { id: "ngwaci", label: "Sweet Potato" },
  { id: "githeri", label: "Githeri" },
  { id: "fruit", label: "Fruits" },
  { id: "rice", label: "Rice" },
];

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const [formData, setFormData] = useState<OnboardingData>({
    sport: "",
    age: 25,
    weight: 60,
    height: 170,
    trainingDays: "4",
    intensity: "moderate",
    foods: [],
    goal: "",
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

  const canProceed = () => {
    if (step === 1) return formData.sport !== "";
    if (step === 4) return formData.foods.length > 0;
    if (step === 5) return formData.goal !== "";
    return true;
  };

  return (
    <div className="w-[375px] h-[812px] mx-auto my-8 flex flex-col bg-background text-foreground p-4 rounded-3xl lg:border-4 lg:border-gray-400 lg:shadow-lg relative overflow-hidden">
      {/* mobile notch */}
      <div className="absolute hidden lg:block top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-b-xl"></div>

      {/* Simple Header */}
      <div className="flex items-center justify-between mb-6 pt-6">
        <h1 className="text-xl font-bold">Athlete Profile</h1>
        <div className="text-sm text-muted-foreground">
          {step}/{totalSteps}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Step 1: Sport Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Your Sport</h2>
              <p className="text-muted-foreground mt-1">What do you train for?</p>
            </div>
            <RadioGroup
              value={formData.sport}
              onValueChange={(val) => updateField("sport", val)}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { val: "running", label: "Running", icon: "🏃🏿" },
                { val: "sprints", label: "Sprints", icon: "⚡" },
                { val: "rugby", label: "Rugby", icon: "🏉" },
                { val: "football", label: "Football", icon: "⚽" },
                { val: "basketball", label: "Basketball", icon: "🏀" },
                { val: "volleyball", label: "Volleyball", icon: "🏐" },
                { val: "athletics", label: "Athletics", icon: "🏅" },
                { val: "boxing", label: "Boxing", icon: "🥊" },
                { val: "swimming", label: "Swimming", icon: "🏊🏿" },
                { val: "cycling", label: "Cycling", icon: "🚴🏿" },
                { val: "cricket", label: "Cricket", icon: "🏏" },
                { val: "netball", label: "Netball", icon: "🥅" },
              ].map((sport) => (
                <div key={sport.val}>
                  <RadioGroupItem
                    value={sport.val}
                    id={sport.val}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={sport.val}
                    className="flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 transition-all h-20"
                  >
                    <span className="text-2xl mb-1">{sport.icon}</span>
                    <span className="font-medium text-xs text-center">
                      {sport.label}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Body Stats */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold">Body Stats</h2>
              <p className="text-muted-foreground mt-1">Basic measurements</p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <Label className="text-base">Weight</Label>
                  <span className="text-3xl font-bold">
                    {formData.weight}
                    <span className="text-sm text-muted-foreground ml-1">kg</span>
                  </span>
                </div>
                <Slider
                  value={[formData.weight]}
                  min={40}
                  max={120}
                  step={1}
                  onValueChange={(val) => updateField("weight", val[0])}
                  className="py-2"
                />
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <Label className="text-base">Height</Label>
                  <span className="text-3xl font-bold">
                    {formData.height}
                    <span className="text-sm text-muted-foreground ml-1">cm</span>
                  </span>
                </div>
                <Slider
                  value={[formData.height]}
                  min={140}
                  max={210}
                  step={1}
                  onValueChange={(val) => updateField("height", val[0])}
                  className="py-2"
                />
              </div>

              <div>
                <Label htmlFor="age" className="text-base mb-2 block">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateField("age", parseInt(e.target.value))}
                  className="text-2xl py-6 text-center font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Training Schedule */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold">Training</h2>
              <p className="text-muted-foreground mt-1">Your weekly schedule</p>
            </div>

            <div className="space-y-3">
              <Label className="text-base">Training Days Per Week</Label>
              <Select
                onValueChange={(val) => updateField("trainingDays", val)}
                value={formData.trainingDays}
              >
                <SelectTrigger className="w-full py-7 text-xl font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <SelectItem key={num} value={num.toString()} className="text-lg">
                      {num} {num === 1 ? "day" : "days"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-base">Training Intensity</Label>
              <Tabs
                value={formData.intensity}
                onValueChange={(val) => updateField("intensity", val)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 h-14">
                  <TabsTrigger value="low" className="text-base">Easy</TabsTrigger>
                  <TabsTrigger value="moderate" className="text-base">Moderate</TabsTrigger>
                  <TabsTrigger value="high" className="text-base">Hard</TabsTrigger>
                </TabsList>
              </Tabs>
              <p className="text-sm text-muted-foreground mt-3 text-center">
                {formData.intensity === "high"
                  ? "High intensity & competition pace"
                  : formData.intensity === "moderate"
                  ? "Regular training sessions"
                  : "Recovery & light sessions"}
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Food Preferences */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Your Foods</h2>
              <p className="text-muted-foreground mt-1">
                Select what you eat regularly
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {KENYAN_FOODS.map((food) => (
                <div
                  key={food.id}
                  className={`flex items-center space-x-2 border-2 p-3 rounded-lg cursor-pointer transition-all ${
                    formData.foods.includes(food.id)
                      ? "border-primary bg-primary/10"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => toggleFood(food.id)}
                >
                  <Checkbox
                    id={food.id}
                    checked={formData.foods.includes(food.id)}
                    onCheckedChange={() => toggleFood(food.id)}
                  />
                  <Label
                    htmlFor={food.id}
                    className="text-sm flex-1 cursor-pointer font-medium"
                  >
                    {food.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Goal */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Your Goal</h2>
              <p className="text-muted-foreground mt-1">
                What are you working towards?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  id: "lose",
                  title: "Lose Weight",
                  desc: "Get leaner & lighter",
                  icon: "📉",
                },
                {
                  id: "maintain",
                  title: "Maintain",
                  desc: "Stay at current weight",
                  icon: "⚖️",
                },
                {
                  id: "gain",
                  title: "Gain Muscle",
                  desc: "Build strength & size",
                  icon: "💪🏿",
                },
                {
                  id: "perform",
                  title: "Performance",
                  desc: "Optimize for competition",
                  icon: "🏆",
                },
              ].map((goal) => (
                <Card
                  key={goal.id}
                  className={`cursor-pointer transition-all ${
                    formData.goal === goal.id
                      ? "ring-2 ring-primary bg-primary/10"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => updateField("goal", goal.id)}
                >
                  <CardContent className="flex items-center p-4 gap-3">
                    <div className="text-3xl">{goal.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {goal.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t flex gap-3">
        <Button
          variant="outline"
          className="flex-1 h-12"
          onClick={handleBack}
          disabled={step === 1}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <Button
          className="flex-1 h-12 font-semibold"
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {step === totalSteps ? "Complete Setup" : "Next"}
          {step !== totalSteps && <ChevronRight className="ml-1 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}