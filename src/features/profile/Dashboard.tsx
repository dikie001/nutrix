import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Added Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { USER_DATA } from "@/lib/constants";
import { getUserLocation } from "@/lib/getLocation";
import {
  AlertCircle,
  Clock,
  Droplet,
  Flame,
  Sparkles,
  TrendingUp,
  Zap
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingNavbar } from "../../components/Navbar";

const data = {
  stats: {
    energy: 7,
    hydration: 1250,
    hydrationGoal: 2500,
    calories: 1450,
    calorieGoal: 2200,
  },
  meals: [
    {
      id: "1",
      name: "Oatmeal & Berries",
      time: "08:00",
      calories: 450,
      type: "Breakfast",
    },
    {
      id: "2",
      name: "Grilled Chicken Salad",
      time: "13:00",
      calories: 600,
      type: "Lunch",
    },
    {
      id: "3",
      name: "Protein Shake",
      time: "16:00",
      calories: 200,
      type: "Snack",
    },
  ],
  alerts: [
    { id: "a1", level: "critical", message: "Protein intake low (-30g)" },
    { id: "a2", level: "warning", message: "Hydration behind schedule" },
    { id: "a3", level: "info", message: "Dinner planned for 19:00" },
  ],
};

const Dashboard = () => {
  const hydrationPercent =
    (data.stats.hydration / data.stats.hydrationGoal) * 100;
  const caloriePercent = (data.stats.calories / data.stats.calorieGoal) * 100;
  const navigate = useNavigate();

  // Get the user location
  useEffect(() => {
    const data = localStorage.getItem(USER_DATA);
    const userData = data ? JSON.parse(data) : [];
    const getLocation = async () => {
      const location = await getUserLocation();
      console.log(location);
      const updatedUserData = { ...userData, location: location };
      localStorage.setItem(USER_DATA, JSON.stringify(updatedUserData));
    };

    getLocation();
  },[]);

  return (
    <div className="min-h-screen overflow-y-auto bg-linear-to-br relative from-background to-muted/20 p-2">
      <OnboardingNavbar currentLang="en" onLanguageChange={() => alert()} />

      {/* Main Content */}
        <div className="max-w-7xl mx-auto space-y-4 pb-20">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Daily Vitality
              </h1>
              <p className="text-sm text-muted-foreground">
                Track your wellness journey
              </p>
            </div>
            <Badge
              variant="secondary"
              className="w-fit text-xs sm:text-sm px-3 py-1.5"
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Badge>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-2">
            {/* Energy Card */}
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Energy Level
                </CardTitle>
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Zap className="h-4 w-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-bold">
                    {data.stats.energy}
                  </span>
                  <span className="text-xl text-muted-foreground">/10</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <p className="text-xs text-muted-foreground">
                    Feeling good today
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Hydration Card */}
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Hydration
                </CardTitle>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Droplet className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-bold">
                    {data.stats.hydration}
                  </span>
                  <span className="text-sm text-muted-foreground">ml</span>
                </div>
                <div className="space-y-2 mt-3">
                  <Progress value={hydrationPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round(hydrationPercent)}% of{" "}
                    {data.stats.hydrationGoal}
                    ml goal
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Calories Card */}
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg sm:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Calories
                </CardTitle>
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Flame className="h-4 w-4 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-bold">
                    {data.stats.calories}
                  </span>
                  <span className="text-sm text-muted-foreground">kcal</span>
                </div>
                <div className="space-y-2 mt-3">
                  <Progress value={caloriePercent} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round(caloriePercent)}% of {data.stats.calorieGoal}{" "}
                    kcal goal
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col space-y-4">
            {/* Timeline */}
            <Card className="lg:col-span-2 border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg md:text-xl">
                  Today's Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {data.meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group border border-transparent hover:border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold">{meal.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge
                            variant="outline"
                            className="px-1.5 py-0 text-[10px]"
                          >
                            {meal.type}
                          </Badge>
                          <span>{meal.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 ml-[52px] sm:ml-0">
                      <span className="text-sm font-bold">{meal.calories}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        kcal
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="lg:col-span-1 border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg md:text-xl">Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${
                      alert.level === "critical"
                        ? "bg-red-500/5 border-l-red-500"
                        : alert.level === "warning"
                        ? "bg-orange-500/5 border-l-orange-500"
                        : "bg-blue-500/5 border-l-blue-500"
                    }`}
                  >
                    <AlertCircle
                      className={`h-4 w-4 mt-0.5 shrink-0 ${
                        alert.level === "critical"
                          ? "text-red-500"
                          : alert.level === "warning"
                          ? "text-orange-500"
                          : "text-blue-500"
                      }`}
                    />
                    <p className="text-sm leading-relaxed">{alert.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
     

      {/* Floating AI Action Button  */}
      <div className="sticky bottom-16 w-full flex justify-end px-2 z-50 pointer-events-none">
        <Button
          onClick={() => navigate("/ai")}
          size="icon"
          className="h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300 pointer-events-auto"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
