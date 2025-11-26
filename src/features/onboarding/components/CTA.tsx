import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Target, TrendingUp, Zap } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export default function CTA({
  setStart,
}: {
  setStart: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold">Athlete Fuel</span>
          </div>
          <CardTitle className="text-3xl">
            Train Smarter, Perform Better
          </CardTitle>
          <CardDescription className="text-base">
            Personalized nutrition plans designed for Kenyan athletes
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">
                  Sport-Specific Plans
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tailored nutrition for your discipline
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your performance metrics
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <Zap className="h-5 w-5" />
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
            className="w-full h-12 text-base"
            onClick={() => setStart(true)}
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Setup takes less than 2 minutes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
