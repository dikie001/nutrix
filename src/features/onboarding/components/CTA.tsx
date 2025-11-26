import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Target, TrendingUp } from "lucide-react";

export default function AthleteCTACard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden border-0 shadow-2xl">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Zap className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Athlete Fuel</h1>
          </div>
          <h2 className="text-3xl font-bold mb-3 leading-tight">
            Train Smarter,
            <br />
            Perform Better
          </h2>
          <p className="text-emerald-50 text-lg">
            Personalized nutrition plans designed for Kenyan athletes
          </p>
        </div>

        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Target className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">Sport-Specific Plans</h3>
                <p className="text-sm text-muted-foreground">
                  Tailored nutrition for your discipline
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your performance metrics
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">Local Foods</h3>
                <p className="text-sm text-muted-foreground">
                  Plans based on foods you actually eat
                </p>
              </div>
            </div>
          </div>

          <Button 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg"
            onClick={() => alert("Starting onboarding...")}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Setup takes less than 2 minutes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}