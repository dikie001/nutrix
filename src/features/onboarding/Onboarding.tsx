/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { USER_DATA, USER_REGISTERED } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CTA from "./components/CTA";
import type { UserLocation } from "@/lib/getLocation";

// --- Types ---
type OnboardingData = {
  sport: string;
  age: number;
  name: string;
  gender: "male" | "female" | "";
  location: UserLocation;
  weight: number;
  height: number;
  trainingDays: string;
  intensity: "low" | "moderate" | "high";
  goal: string;
};

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;
  const [start, setStart] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<OnboardingData>({
    sport: "",
    name: "",
    location: { latitude: 0, longitude: 0, address: "" },
    age: 25,
    weight: 60,
    gender: "",
    height: 170,
    trainingDays: "4",
    intensity: "moderate",
    goal: "",
  });

  //  Tab switching
  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
    if (step == 4) {
      localStorage.setItem(USER_DATA, JSON.stringify(formData));
      localStorage.setItem(USER_REGISTERED, "true");
      navigate("/create-password");
      toast.success("Your data has been saved");
    }

    console.log(formData);
  };
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateField = (field: keyof OnboardingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // proceed to next step
  const canProceed = () => {
    if (step === 1) {
      return formData.sport !== "";
    }
    if (step === 4) return formData.goal !== "";
    return true;
  };

  // GEt the user location

  return (
    <div className="overflow-y-auto scrollbar-thin  flex flex-col bg-background text-foreground ">
      {!start ? (
        <CTA setStart={setStart} />
      ) : (
        <div className="">
          {/*  Header */}
          <div className="flex items-center justify-between p-4 pt-8">
            <h1 className="text-xl font-bold">Setup Profile</h1>
            <div className="text-sm text-muted-foreground">
              {step}/{totalSteps}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-4 pb-4">
            <Progress value={progress} className="h-2" />
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {/* Step 1: Sport Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Your Sport</h2>
                  <p className="text-muted-foreground mt-1">
                    What do you train for?
                  </p>
                </div>
                <RadioGroup
                  value={formData.sport}
                  onValueChange={(val) => {
                    updateField("sport", val);
                  }}
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { val: "running", label: "Running", icon: "🏃🏿" },
                    { val: "football", label: "Football", icon: "⚽" },
                    { val: "rugby", label: "Rugby", icon: "🏉" },
                    { val: "basketball", label: "Basketball", icon: "🏀" },
                    { val: "athletics", label: "Athletics", icon: "🏅" },
                    { val: "other", label: "Other", icon: "➕" },
                  ].map((sport) => (
                    <div key={sport.val}>
                      <RadioGroupItem
                        value={sport.val}
                        id={sport.val}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={sport.val}
                        className="flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 transition-all h-24"
                      >
                        <span className="text-3xl mb-2">{sport.icon}</span>
                        <span className="font-medium text-sm text-center">
                          {sport.label}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {formData.sport === "other" && (
                  <div className="pt-2 pb-28">
                    <Label htmlFor="customSport" className="text-sm mb-2 block">
                      Specify your sport
                    </Label>
                    <Input
                      id="customSport"
                      placeholder="e.g., Swimming, Boxing, Cricket..."
                      value={formData.sport}
                      onChange={(e) => updateField("sport", e.target.value)}
                      className="text-base py-6"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Body Stats */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">Body Stats</h2>
                  <p className="text-muted-foreground mt-1">
                    Basic measurements
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Weight Slider */}
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <Label className="text-base">Weight</Label>
                      <span className="text-3xl font-bold">
                        {formData.weight}
                        <span className="text-sm text-muted-foreground ml-1">
                          kg
                        </span>
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

                  {/* Height Slider */}
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <Label className="text-base">Height</Label>
                      <span className="text-3xl font-bold">
                        {formData.height}
                        <span className="text-sm text-muted-foreground ml-1">
                          cm
                        </span>
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

                  {/* Age Input */}
                  <div>
                    <Label htmlFor="age" className="text-base mb-2 block">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        updateField("age", parseInt(e.target.value))
                      }
                      className="text-2xl py-6 text-center font-bold"
                    />
                  </div>

                  {/* Gender Select */}
                  <div>
                    <Label className="text-base mb-2 block">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(val) => updateField("gender", val)}
                    >
                      <SelectTrigger className="w-full py-6 text-lg">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            {/* Step 3: Training Schedule */}
            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold">Training</h2>
                  <p className="text-muted-foreground mt-1">
                    Your weekly schedule
                  </p>
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
                        <SelectItem
                          key={num}
                          value={num.toString()}
                          className="text-lg"
                        >
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
                      <TabsTrigger value="low" className="text-base">
                        Easy
                      </TabsTrigger>
                      <TabsTrigger value="moderate" className="text-base">
                        Moderate
                      </TabsTrigger>
                      <TabsTrigger value="high" className="text-base">
                        Hard
                      </TabsTrigger>
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

            {/* Step 4: Goal */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Your Goal</h2>
                  <p className="text-muted-foreground mt-1">
                    What are you working towards?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      id: "lose",
                      title: "Lose Weight",
                      desc: "Get leaner & lighter",
                      icon: "📉",
                    },
                    {
                      id: "maintain",
                      title: "Maintain weight",
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
                      title: "Optimize Performance",
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
                      <CardContent className="flex flex-col text-center  items-center p-2 gap-3">
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
                     <label className="flex items-center gap-2 pt-2">
              <Input type="checkbox" className="h-4 w-4 cursor-pointer" />
              <span className="text-sm">
                I agree to the{" "}
                <a href="/terms" className="underline cursor-pointer">
                  Terms & Conditions
                </a>
                {" and "}  
                <a href="/privacy" className="underline cursor-pointer">
                  Privacy Policy
                </a>
              </span>
            </label>
              </div>
            )}
       
          </div>

          {/* Footer Navigation */}
          <div className="p-4 border-t bg-background absolute w-full bottom-4   flex gap-3">
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
      )}
    </div>
  );
}
