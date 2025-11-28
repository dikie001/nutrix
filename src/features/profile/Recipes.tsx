import { OnboardingNavbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Beef,
  ChefHat,
  ChevronDown,
  ChevronUp,
  Droplet,
  Flame,
  Heart,
  Leaf,
  Timer,
  Trophy,
  Utensils,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- Recipe Data (Optimized for Athletes) ---
interface Recipe {
  id: string;
  title: string;
  category: "Pre-Workout" | "Post-Workout" | "Recovery" | "Hydration";
  time: string;
  calories: number;
  protein: string;
  carbs: string;
  imageColor: string;
  icon: any;
  description: string;
  ingredients: string[];
  instructions: string[];
}

const RECIPES: Recipe[] = [
  {
    id: "1",
    title: "Millet Uji Power Bowl",
    category: "Pre-Workout",
    time: "15 min",
    calories: 320,
    protein: "12g",
    carbs: "55g",
    imageColor: "bg-amber-100 text-amber-600",
    icon: Zap,
    description:
      "Fermented millet porridge enriched with groundnuts and milk. Fast-absorbing carbs for explosive energy.",
    ingredients: [
      "1 cup fermented millet flour",
      "2 cups water/milk",
      "1 tbsp peanut butter",
      "Honey to taste",
    ],
    instructions: [
      "Boil water.",
      "Whisk flour paste into boiling water.",
      "Simmer for 10 mins.",
      "Stir in peanut butter and honey.",
    ],
  },
  {
    id: "2",
    title: "Kienyeji Chicken Stew",
    category: "Post-Workout",
    time: "45 min",
    calories: 450,
    protein: "45g",
    carbs: "10g",
    imageColor: "bg-orange-100 text-orange-600",
    icon: Trophy,
    description:
      "Lean free-range chicken slow-cooked with minimal oil. High quality protein for muscle repair.",
    ingredients: [
      "200g Chicken breast/thigh",
      "Ginger & Garlic",
      "Tomatoes & Dhania",
      "1 tbsp Olive oil",
    ],
    instructions: [
      "Sauté onions and aromatics.",
      "Sear chicken chunks.",
      "Add tomatoes and simmer until tender.",
      "Garnish with fresh Dhania.",
    ],
  },
  {
    id: "3",
    title: "Sweet Potato (Ngwaci) Hash",
    category: "Pre-Workout",
    time: "25 min",
    calories: 280,
    protein: "6g",
    carbs: "60g",
    imageColor: "bg-purple-100 text-purple-600",
    icon: Flame,
    description:
      "Boiled and pan-seared sweet potatoes. Complex carbs that release energy slowly during long runs.",
    ingredients: [
      "2 large sweet potatoes",
      "Cinnamon",
      "Pinch of salt",
      "Coconut oil",
    ],
    instructions: [
      "Boil potatoes until soft.",
      "Cube and pan-sear in coconut oil.",
      "Sprinkle with cinnamon.",
    ],
  },
  {
    id: "4",
    title: "High-Octane Githeri",
    category: "Recovery",
    time: "30 min",
    calories: 520,
    protein: "22g",
    carbs: "75g",
    imageColor: "bg-red-100 text-red-600",
    icon: Heart,
    description:
      "A mix of beans, maize, and avocado. The ultimate plant-based recovery meal rich in fiber and healthy fats.",
    ingredients: [
      "1 cup boiled maize & beans",
      "1/2 Avocado",
      "Diced tomatoes",
      "Chili (optional)",
    ],
    instructions: [
      "Fry boiled githeri with onions and tomatoes.",
      "Season lightly.",
      "Serve topped with sliced avocado.",
    ],
  },
  {
    id: "5",
    title: "Tilapia & Kachumbari",
    category: "Post-Workout",
    time: "20 min",
    calories: 380,
    protein: "35g",
    carbs: "5g",
    imageColor: "bg-blue-100 text-blue-600",
    icon: Utensils,
    description:
      "Grilled fresh Tilapia with a spicy tomato-onion salad. Light, rich in Omega-3s for joint health.",
    ingredients: [
      "1 Fresh Tilapia fillet",
      "Lemon juice",
      "Onions & Tomatoes",
      "Coriander",
    ],
    instructions: [
      "Marinate fish in lemon and herbs.",
      "Pan-sear or grill.",
      "Dice veggies for kachumbari.",
      "Serve together.",
    ],
  },
  {
    id: "6",
    title: "Ndengu & Chapati Roll",
    category: "Recovery",
    time: "40 min",
    calories: 600,
    protein: "18g",
    carbs: "85g",
    imageColor: "bg-green-100 text-green-600",
    icon: Leaf,
    description:
      "Green grams stewed in coconut milk wrapped in a whole wheat chapati. Perfect for carb-loading.",
    ingredients: [
      "1 cup Green grams (Ndengu)",
      "Coconut milk",
      "1 Chapati",
      "Cumin",
    ],
    instructions: [
      "Fry Ndengu with cumin and turmeric.",
      "Add coconut milk and simmer.",
      "Roll thick stew into chapati.",
    ],
  },
  {
    id: "7",
    title: "Baobab (Mabuyu) Electrolyte",
    category: "Hydration",
    time: "5 min",
    calories: 45,
    protein: "1g",
    carbs: "10g",
    imageColor: "bg-yellow-100 text-yellow-600",
    icon: Droplet,
    description:
      "Natural energy drink made from Baobab powder. Extremely high in Vitamin C and electrolytes.",
    ingredients: [
      "2 tbsp Baobab powder",
      "500ml Water",
      "1 tsp Chia seeds",
      "Honey",
    ],
    instructions: [
      "Mix powder with water until dissolved.",
      "Add chia seeds and honey.",
      "Shake well and chill.",
    ],
  },
  {
    id: "8",
    title: "Sukuma Wiki & Beef Strips",
    category: "Post-Workout",
    time: "20 min",
    calories: 350,
    protein: "30g",
    carbs: "12g",
    imageColor: "bg-emerald-100 text-emerald-600",
    icon: Beef,
    description:
      "Iron-rich collard greens stir-fried with lean beef strips. Essential for oxygen transport in blood.",
    ingredients: [
      "200g Lean beef strips",
      "1 bunch Sukuma Wiki",
      "Garlic",
      "Soy sauce",
    ],
    instructions: [
      "Flash fry beef with garlic.",
      "Add chopped Sukuma Wiki.",
      "Stir-fry for 3 mins to keep crunch.",
      "Add soy sauce.",
    ],
  },
  {
    id: "9",
    title: "PB & Banana Chapati",
    category: "Pre-Workout",
    time: "5 min",
    calories: 290,
    protein: "8g",
    carbs: "45g",
    imageColor: "bg-amber-50 text-amber-700",
    icon: Zap,
    description:
      "Quick energy snack. Potassium from bananas prevents cramps, PB provides sustained fuel.",
    ingredients: ["1/2 Chapati", "1 tbsp Peanut butter", "1 Banana"],
    instructions: [
      "Spread PB on chapati.",
      "Place peeled banana inside.",
      "Roll it up tight.",
      "Slice into bites.",
    ],
  },
  {
    id: "10",
    title: "Dawa Tonic",
    category: "Hydration",
    time: "10 min",
    calories: 60,
    protein: "0g",
    carbs: "15g",
    imageColor: "bg-lime-100 text-lime-600",
    icon: Droplet,
    description:
      "Hot ginger, lemon, and honey drink. Reduces inflammation and boosts immunity after cold morning runs.",
    ingredients: ["Fresh ginger root", "1 Lemon", "1 tbsp Honey", "Hot water"],
    instructions: [
      "Crush ginger and boil.",
      "Squeeze lemon juice.",
      "Stir in honey.",
      "Drink warm.",
    ],
  },
];

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 border-l-4 ${
        expanded ? "ring-2 ring-primary/20" : ""
      } ${
        recipe.category === "Pre-Workout"
          ? "border-l-amber-500"
          : recipe.category === "Post-Workout"
          ? "border-l-blue-500"
          : recipe.category === "Recovery"
          ? "border-l-green-500"
          : "border-l-cyan-500"
      }`}
    >
      <div onClick={() => setExpanded(!expanded)} className="cursor-pointer">
        <CardHeader className="flex flex-row items-start space-y-0 pb-2">
          <div className="flex-1">
            <Badge
              variant="secondary"
              className="mb-2 text-[10px] uppercase tracking-wider font-semibold"
            >
              {recipe.category}
            </Badge>
            <CardTitle className="text-lg leading-tight">
              {recipe.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1 text-xs">
              {recipe.description}
            </CardDescription>
          </div>
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ml-3 ${recipe.imageColor}`}
          >
            <recipe.icon className="h-6 w-6" />
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
            <div className="flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" />
              {recipe.time}
            </div>
            <div className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" />
              {recipe.calories} kcal
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Badge
                variant="outline"
                className="h-5 text-[10px] px-1 border-blue-200 text-blue-700 bg-blue-50"
              >
                P: {recipe.protein}
              </Badge>
              <Badge
                variant="outline"
                className="h-5 text-[10px] px-1 border-orange-200 text-orange-700 bg-orange-50"
              >
                C: {recipe.carbs}
              </Badge>
            </div>
          </div>
        </CardContent>
      </div>

      {expanded && (
        <>
          <Separator />
          <CardFooter className="flex flex-col items-start pt-4 gap-4 bg-muted/30 animate-in slide-in-from-top-2 duration-200">
            <div className="w-full space-y-2">
              <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                <Leaf className="h-3 w-3" /> Ingredients
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} className="text-xs flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-primary shrink-0" />
                    {ing}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full space-y-2">
              <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                <ChefHat className="h-3 w-3" /> Instructions
              </h4>
              <ol className="space-y-2">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="text-sm text-foreground/90 flex gap-2">
                    <span className="font-bold text-primary text-xs mt-0.5">
                      {i + 1}.
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </CardFooter>
        </>
      )}

      <div
        onClick={() => setExpanded(!expanded)}
        className="h-6 flex items-center justify-center bg-muted/50 hover:bg-muted text-muted-foreground cursor-pointer transition-colors"
      >
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </Card>
  );
};

export default function Recipes() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

  const filteredRecipes =
    activeTab === "All"
      ? RECIPES
      : RECIPES.filter((r) => r.category === activeTab);

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans pb-6">
      {/* Mobile Sticky Header */}
      {/* <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b px-4 py-3 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)} 
          className="h-9 w-9 -ml-2 rounded-full active:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold leading-none">Athlete Kitchen</h1>
          <p className="text-xs text-muted-foreground">Fuel for dikie.</p>
        </div>
        <div className="ml-auto bg-primary/10 text-primary p-2 rounded-full">
          <ChefHat className="h-5 w-5" />
        </div>
      </div> */}
      <OnboardingNavbar currentLang="en" onLanguageChange={() => {}} />

      {/* Filter Tabs */}
      <div className="sticky top-[61px] z-10 bg-background pt-3 pb-2 px-4 shadow-sm">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 pb-2">
            {[
              "All",
              "Pre-Workout",
              "Post-Workout",
              "Recovery",
              "Hydration",
            ].map((cat) => (
              <Button
                key={cat}
                variant={activeTab === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(cat)}
                className={`rounded-full h-8 px-4 text-xs font-medium transition-all ${
                  activeTab === cat ? "shadow-md scale-105" : "border-dashed"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>

      {/* Recipe List */}
      <div className="px-4 py-4 space-y-4 flex-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 px-1">
          <span>{filteredRecipes.length} recipes found</span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" /> High Performance
          </span>
        </div>

        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}

        {filteredRecipes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
              <Utensils className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              No recipes found in this category.
            </p>
            <Button variant="link" onClick={() => setActiveTab("All")}>
              View All Recipes
            </Button>
          </div>
        )}
      </div>

      {/* Quick Action Footer */}
      <div className="fixed bottom-6 right-6">
        <Button className="rounded-full h-14 w-14 shadow-xl bg-primary text-primary-foreground">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

// Icon for the FAB
function Plus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
