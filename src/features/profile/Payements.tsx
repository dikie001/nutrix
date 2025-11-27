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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, CreditCard, Lock, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";

export default function Payments() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"standard" | "premium">("premium");

  const plans = {
    standard: {
      price: isYearly ? 0 : 0,
      period: isYearly ? "/year" : "/month",
      name: "Standard",
      desc: "Essential features for daily use",
    },
    premium: {
      price: isYearly ? 999 : 99,
      period: isYearly ? "/year" : "/month",
      name: "Gold Premium",
      desc: "Unlock limitless potential",
    },
  };

  return (
    <div className="min-h-screen bg-muted/30 overflow-y-auto flex flex-col mt-4  font-sans">
      <OnboardingNavbar currentLang="en" onLanguageChange={() => {}} />
      <div className=" mx-auto space-y-8 p-2 mb-8 ">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight mt-2 ">Upgrade your Experience</h1>
          <p className="text-muted-foreground">Choose the perfect plan for your health journey.</p>
        </div> 

        {/* Main Grid */}
        <div className="flex flex-col gap-4">
          
          {/* LEFT COLUMN: Pricing Plans */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm ${!isYearly ? "font-semibold text-primary" : "text-muted-foreground"}`}>Monthly</span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className={`text-sm ${isYearly ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                Yearly <Badge variant="secondary" className="ml-1 text-xs bg-amber-100 text-amber-800 hover:bg-amber-100">Save 20%</Badge>
              </span>
            </div>

            <div className="flex flex-col gap-6">
              {/* Standard Plan */}
              <Card 
                className={`cursor-pointer transition-all ${selectedPlan === "standard" ? "border-primary ring-1 ring-primary" : "hover:border-primary/50"}`}
                onClick={() => setSelectedPlan("standard")}
              >
                <CardHeader>
                  <CardTitle>Standard</CardTitle>
                  <CardDescription>Free forever</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">0 Ksh<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Daily Meal Tracking</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Basic Analytics</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Community Access</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Premium Plan (Golden Theme) */}
              <Card 
                className={`relative cursor-pointer transition-all overflow-hidden ${selectedPlan === "premium" ? "border-amber-400 ring-2 ring-amber-400/50 shadow-xl shadow-amber-500/10" : "hover:border-amber-400/50"}`}
                onClick={() => setSelectedPlan("premium")}
              >
                <div className="absolute top-0 right-0 p-3">
                    {selectedPlan === "premium" && <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-amber-950 flex items-center justify-between">
                    Gold Premium
                    <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                  </CardTitle>
                  <CardDescription className="text-amber-900/60">Best for serious tracking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-amber-950">
                    {plans.premium.price} Ksh
                    <span className="text-base font-normal text-amber-900/60">{plans.premium.period}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-600" /> <span className="text-foreground">Realtime analysis</span></li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-600" /> <span className="text-foreground">Advanced Nutrients</span></li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-600" /> <span className="text-foreground">Unlimited History</span></li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-600" /> <span className="text-foreground">Priority Support</span></li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-600" /> <span className="text-foreground">Export Data</span></li>
                    
                  </ul>
                </CardContent>
                {/* Gold Gradient Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-linear-to-tr from-amber-50/50 via-transparent to-transparent opacity-50" />
              </Card>
            </div>
          </div>

          {/* RIGHT COLUMN: Checkout Form */}
          <div className="lg:col-span-1">
            <Card className="h-full border-muted-foreground/20 shadow-lg">
              <CardHeader className="bg-muted/50 pb-6">
                <CardTitle className="text-lg">Order Summary</CardTitle>
                <CardDescription>Review your plan and pay securely.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                
                {/* Summary Row */}
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-muted-foreground">Selected Plan</span>
                  <span className="font-semibold">{plans[selectedPlan].name}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-bold tracking-tight">
                    {plans[selectedPlan].price} Ksh
                  </span>
                  <span className="text-sm text-muted-foreground">{plans[selectedPlan].period}</span>
                </div>

                <Separator />

                {/* Payment Methods */}
                <Tabs defaultValue="card" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="card">Card</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="card" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name on Card</Label>
                      <Input id="name" placeholder="J. Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="number">Card Number</Label>
                      <div className="relative">
                        <Input id="number" placeholder="0000 0000 0000 0000" />
                        <CreditCard className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="paypal">
                    <div className="flex flex-col items-center justify-center h-[180px] space-y-3 bg-muted/20 rounded-md border border-dashed">
                      <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground text-center px-4">
                        You will be redirected to PayPal to securely complete your payment.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

              </CardContent>
              <CardFooter className="flex flex-col pb-18 gap-4 bg-muted/20 pt-6  ">
                <Button 
                  className={`w-full h-12 text-base font-semibold shadow-md transition-all
                    ${selectedPlan === 'premium' 
                      ? "bg-linear-to-r from-amber-500 via-yellow-500 to-amber-500 text-amber-950 hover:from-amber-400 hover:to-amber-400" 
                      : ""
                    }
                  `}
                >
                  {selectedPlan === 'premium' ? 'Upgrade Now' : 'Continue with Standard'}
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Secure encrypted payment
                </div>
              </CardFooter>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}