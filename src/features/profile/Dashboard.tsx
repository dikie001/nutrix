import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { USER_DATA } from "@/lib/constants";
import { getUserLocation } from "@/lib/getLocation";
import {
  Coffee,
  Droplet,
  Flame,
  MapPin,
  Moon,
  Sparkles,
  Sun,
  TrendingUp,
  Utensils
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingNavbar } from "../../components/Navbar";

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  type: string;
  icon: typeof Coffee;
}

interface Stats {
  energy: number;
  hydration: number;
  hydrationGoal: number;
  calories: number;
  calorieGoal: number;
}

const getDynamicMeals = (): Meal[] => {
  const hour = new Date().getHours();
  if (hour < 11) {
    return [
      { id: "1", name: "Chai & Mahamri", time: "08:00", calories: 350, type: "Breakfast", icon: Coffee },
      { id: "2", name: "Uji Power (Millet)", time: "10:30", calories: 180, type: "Snack", icon: Sun },
    ];
  } else if (hour < 16) {
    return [
      { id: "3", name: "Githeri Special", time: "13:00", calories: 550, type: "Lunch", icon: Utensils },
      { id: "4", name: "Dawa (Ginger/Lemon)", time: "15:30", calories: 45, type: "Refreshment", icon: Droplet },
    ];
  } else {
    return [
      { id: "5", name: "Ugali & Sukuma Wiki", time: "19:00", calories: 600, type: "Dinner", icon: Moon },
      { id: "6", name: "Nyama Choma", time: "20:30", calories: 400, type: "Late Bite", icon: Flame },
    ];
  }
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Habari ya Asubuhi";
  if (hour < 17) return "Habari ya Mchana";
  return "Habari ya Jioni";
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [locationName, setLocationName] = useState("Nairobi, KE");
  const [meals, setMeals] = useState<Meal[]>(getDynamicMeals());

  const stats: Stats = {
    energy: 8,
    hydration: 1450,
    hydrationGoal: 2500,
    calories: 1650,
    calorieGoal: 2200,
  };

  const hydrationPercent = (stats.hydration / stats.hydrationGoal) * 100;
  const caloriePercent = (stats.calories / stats.calorieGoal) * 100;

  useEffect(() => {
    setMeals(getDynamicMeals());
    const fetchLocation = async () => {
      const data = localStorage.getItem(USER_DATA);
      const userData = data ? JSON.parse(data) : {};
      try {
        const loc = await getUserLocation();
        setLocationName(loc.address.split(" ")[0] || "Kenya");
        localStorage.setItem(USER_DATA, JSON.stringify({ ...userData, location: loc }));
      } catch (e) {
        console.log("Location fetch failed", e);
      }
    };
    fetchLocation();
  }, []);

  return (
    <div className="min-h-screen bg-background relative pb-24 font-sans">
      <OnboardingNavbar currentLang="en" onLanguageChange={() => {}} />

      <main className="px-4 py-6 space-y-6 max-w-md mx-auto">
        
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {getGreeting()}, <span className="text-primary">dikie.</span>
              </h1>
              <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{locationName}</span>
                <span className="text-xs text-muted-foreground/40">•</span>
                <span className="text-xs">
                  {new Date().toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short" })}
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate("/ai")} 
            className="w-full shadow-sm bg-linear-to-r from-primary to-primary/90 h-11 text-sm"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Ask AI Assistant
          </Button>
        </div>

        {/* Stats Grid - Optimized for Mobile */}
        <div className="grid grid-cols-2 gap-3">
          {/* Energy Card */}
     <Card className="border-l-4 border-l-blue-500 shadow-sm">
  <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between space-y-0">
    <span className="text-xs font-medium text-muted-foreground">Micronutrient Score</span>
    <Sparkles className="h-3.5 w-3.5 text-blue-500" />
  </CardHeader>

  <CardContent className="p-3 pt-1">
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold">96</span>
      <span className="text-[10px] text-muted-foreground">/100</span>
    </div>

    <div className="flex items-center gap-1 mt-1 text-green-600">
      <TrendingUp className="h-3 w-3" />
      <span className="text-[10px] font-medium leading-none">Balanced</span>
    </div>
  </CardContent>
</Card>



          {/* Hydration Card */}
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between space-y-0">
              <span className="text-xs font-medium text-muted-foreground">Water</span>
              <Droplet className="h-3.5 w-3.5 text-blue-500" />
            </CardHeader>
            <CardContent className="p-3 pt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">
                    {stats.hydration >= 1000 ? (stats.hydration / 1000).toFixed(1) + 'L' : stats.hydration}
                </span>
              </div>
              <Progress value={hydrationPercent} className="h-1.5 mt-2 bg-blue-100" />
              <p className="text-[10px] text-muted-foreground mt-1.5">
                {Math.round(100 - hydrationPercent)}% to goal
              </p>
            </CardContent>
          </Card>

          {/* Calories Card - Full Width */}
          <Card className="col-span-2 border-l-4 border-l-red-500 shadow-sm">
             <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Calories</CardTitle>
              <Flame className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold">{stats.calories}</span>
                    <span className="text-xs text-muted-foreground">kcal consumed</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground mb-1">
                    Goal: {stats.calorieGoal}
                </span>
              </div>
              <Progress value={caloriePercent} className="h-2.5 bg-red-100" />
            </CardContent>
          </Card>
        </div>

        {/* Meals Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1 flex items-center gap-2">
             <Utensils className="h-3.5 w-3.5" /> Upcoming Meals
          </h3>
          
          <div className="space-y-3">
            {meals.map((meal) => {
              const Icon = meal.icon;
              return (
                <div
                  key={meal.id}
                  className="group flex items-center justify-between p-3 rounded-xl bg-white border border-border/60 shadow-sm active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm leading-tight">{meal.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="font-medium text-foreground/80">{meal.time}</span>
                        <span className="text-border">•</span>
                        <span>{meal.type}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-mono text-[10px] px-1.5 h-5 ml-2 shrink-0">
                    {meal.calories} kcal
                  </Badge>
                </div>
              );
            })}
            {meals.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">
                No meals scheduled.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;