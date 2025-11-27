import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { USER_DATA } from "@/lib/constants";
import { getUserLocation } from "@/lib/getLocation";
import {
  AlertCircle,
  Clock,
  Coffee,
  Droplet,
  Flame,
  MapPin,
  Sparkles,
  Sun,
  Moon,
  TrendingUp,
  Utensils,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingNavbar } from "../../components/Navbar";

// Helper to get time-based Kenyan meals
const getDynamicMeals = () => {
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
  const [meals, setMeals] = useState(getDynamicMeals());
  
  // Static stats for demo
  const stats = {
    energy: 8,
    hydration: 1450,
    hydrationGoal: 2500,
    calories: 1650,
    calorieGoal: 2200,
  };

  const hydrationPercent = (stats.hydration / stats.hydrationGoal) * 100;
  const caloriePercent = (stats.calories / stats.calorieGoal) * 100;

  useEffect(() => {
    // Refresh meals based on time
    setMeals(getDynamicMeals());

    const fetchLocation = async () => {
      const data = localStorage.getItem(USER_DATA);
      const userData = data ? JSON.parse(data) : {};
      
      try {
        const loc = await getUserLocation();
        setLocationName(loc?.city || "Kenya");
        localStorage.setItem(USER_DATA, JSON.stringify({ ...userData, location: loc }));
      } catch (e) {
        console.log("Location fetch failed", e);
      }
    };
    fetchLocation();
  }, []);

  return (
    <div className="min-h-screen bg-background relative pb-20">
      <OnboardingNavbar currentLang="en" onLanguageChange={() => {}} />

      <main className="container max-w-5xl mx-auto p-4 space-y-6">
        {/* Personalized Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              {getGreeting()}, dikie.
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 text-primary/70" />
              <span className="text-sm font-medium">{locationName}</span>
              <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                {new Date().toLocaleDateString("en-KE", { weekday: 'long', day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
          
          <Button onClick={() => navigate("/ai")} className="w-fit shadow-md">
            <Sparkles className="mr-2 h-4 w-4" />
            Ask AI Assistant
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="flex flex-col gap-4">
          {/* Energy */}
          <Card className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vitality</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{stats.energy}</span>
                <span className="text-sm text-muted-foreground">/10</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-medium">High energy today</span>
              </div>
            </CardContent>
          </Card>

          {/* Hydration */}
          <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Hydration</CardTitle>
              <Droplet className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{stats.hydration}</span>
                <span className="text-sm text-muted-foreground">ml</span>
              </div>
              <Progress value={hydrationPercent} className="h-2 mt-3 bg-blue-100" indicatorClassName="bg-blue-500" />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(100 - hydrationPercent)}% to daily goal
              </p>
            </CardContent>
          </Card>

          {/* Calories */}
          <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Calories</CardTitle>
              <Flame className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{stats.calories}</span>
                <span className="text-sm text-muted-foreground">kcal</span>
              </div>
              <Progress value={caloriePercent} className="h-2 mt-3 bg-red-100" indicatorClassName="bg-red-500" />
              <p className="text-xs text-muted-foreground mt-2">
                Target: {stats.calorieGoal} kcal
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          {/* Dynamic Kenyan Meal Timeline */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Utensils className="h-5 w-5 text-primary" />
                Suggested Meals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border hover:bg-muted/60 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <meal.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{meal.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <Clock className="h-3 w-3" />
                          <span>{meal.time}</span>
                          <span className="text-primary/30">•</span>
                          <span>{meal.type}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="font-mono">
                      {meal.calories} kcal
                    </Badge>
                  </div>
                ))}
                {meals.length === 0 && (
                  <p className="text-muted-foreground text-sm">No meals scheduled for this time.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Alerts / Insights */}
          <Card className="h-fit shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 p-3 rounded-md bg-orange-50 border border-orange-100 dark:bg-orange-900/20 dark:border-orange-900">
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-orange-900 dark:text-orange-100">Hydration Alert</p>
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    It's hot in {locationName.split(',')[0]}. Drink 500ml more water.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 p-3 rounded-md bg-green-50 border border-green-100 dark:bg-green-900/20 dark:border-green-900">
                <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">Great Progress</p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    You've hit your protein goal for lunch.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Floating Action Button */}
      {/* <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => navigate("/ai")}
          size="icon"
          className="h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </div> */}
    </div>
  );
};

export default Dashboard;