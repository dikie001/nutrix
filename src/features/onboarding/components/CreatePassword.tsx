import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Delete, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function CreatePassword() {
  const [step, setStep] = useState<"create" | "confirm">("create");
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState<string[]>(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState("");

  const currentPin = step === "create" ? pin : confirmPin;
  const setCurrentPin = step === "create" ? setPin : setConfirmPin;

  const handleNumberClick = (num: string) => {
    if (activeIndex < 4) {
      const newPin = [...currentPin];
      newPin[activeIndex] = num;
      setCurrentPin(newPin);
      setActiveIndex(activeIndex + 1);
      setError("");
    }
  };

  const handleDelete = () => {
    if (activeIndex > 0) {
      const newPin = [...currentPin];
      newPin[activeIndex - 1] = "";
      setCurrentPin(newPin);
      setActiveIndex(activeIndex - 1);
      setError("");
    }
  };

  const handleSubmit = () => {
    if (activeIndex === 4) {
      if (step === "create") {
        // Move to confirm step
        setStep("confirm");
        setActiveIndex(0);
      } else {
        // Validate pins match
        const originalPin = pin.join("");
        const confirmedPin = confirmPin.join("");
        
        if (originalPin === confirmedPin) {
          alert(`PIN Created Successfully: ${originalPin}`);
          // Reset everything
          setPin(["", "", "", ""]);
          setConfirmPin(["", "", "", ""]);
          setActiveIndex(0);
          setStep("create");
          setError("");
        } else {
          setError("PINs don't match. Try again.");
          // Reset confirm step
          setConfirmPin(["", "", "", ""]);
          setActiveIndex(0);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {step === "create" ? "Create Your PIN" : "Confirm Your PIN"}
          </CardTitle>
          <CardDescription>
            {step === "create"
              ? "Choose a 4-digit PIN to secure your account"
              : "Enter your PIN again to confirm"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* PIN Display */}
          <div className="flex justify-center gap-3">
            {currentPin.map((digit, index) => (
              <div
                key={index}
                className={`h-14 w-14 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                  index === activeIndex
                    ? "border-primary bg-primary/5"
                    : digit
                    ? "border-primary bg-secondary"
                    : "border-border"
                }`}
              >
                {digit && "•"}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                variant="outline"
                size="lg"
                className="h-16 text-xl font-semibold"
                onClick={() => handleNumberClick(num.toString())}
                disabled={activeIndex >= 4}
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              size="lg"
              className="h-16"
              onClick={handleDelete}
              disabled={activeIndex === 0}
            >
              <Delete className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-16 text-xl font-semibold"
              onClick={() => handleNumberClick("0")}
              disabled={activeIndex >= 4}
            >
              0
            </Button>
            <div className="h-16"></div>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full h-12 text-base"
            onClick={handleSubmit}
            disabled={activeIndex !== 4}
          >
            {step === "create" ? "Create PIN" : "Confirm PIN"}
            {step === "confirm" && activeIndex === 4 && (
              <CheckCircle2 className="ml-2 h-4 w-4" />
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}