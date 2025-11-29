import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { USER_PAID, USER_PIN, USER_REGISTERED } from "@/lib/constants";
import { Lock, Delete, AlertCircle, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if PIN exists on mount
  useEffect(() => {
    const storedPin = localStorage.getItem(USER_PIN);
    if (!storedPin) {
      toast.error("No PIN found. Please create one.");
      navigate("/create-password");
    }
  }, [navigate]);

  const handleNumberClick = (num: string) => {
    if (activeIndex < 4) {
      const newPin = [...pin];
      newPin[activeIndex] = num;
      setPin(newPin);
      setActiveIndex(activeIndex + 1);
      setError("");
    }
  };

  const handleDelete = () => {
    if (activeIndex > 0) {
      const newPin = [...pin];
      newPin[activeIndex - 1] = "";
      setPin(newPin);
      setActiveIndex(activeIndex - 1);
      setError("");
    }
  };

  const handleLogin = () => {
    if (activeIndex === 4) {
      const storedData = localStorage.getItem(USER_PIN);
      
      if (!storedData) {
        setError("System error: No PIN stored");
        return;
      }

      // The create page stored it as JSON.stringify(string[])
      const storedPin = JSON.parse(storedData);
      const enteredPinStr = pin.join("");
      const storedPinStr = storedPin.join("");

      if (enteredPinStr === storedPinStr) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error("Incorrect pin, please try again")
        // Reset PIN on failure
        setPin(["", "", "", ""]);
        setActiveIndex(0);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-sm border-none">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 -mt-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Lock onClick={()=>{
              localStorage.removeItem(USER_REGISTERED)
              toast.info("Hello there!")
            }} onDoubleClick={()=>{
              localStorage.removeItem(USER_PAID)
              toast.info("Hello again, I hope you are doing great!")
            }} className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your 4-digit PIN to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* PIN Display */}
          <div className="flex justify-center gap-3">
            {pin.map((digit, index) => (
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
                {/* Mask the PIN for security on login page */}
                {digit && "•"}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 absolute top-40 left-1/2 -translate-x-1/2 text-destructive text-sm bg-destructive/20 p-3 rounded-lg w-max shadow-sm">
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
                className="h-16 text-xl font-semibold hover:bg-secondary/80"
                onClick={() => handleNumberClick(num.toString())}
                disabled={activeIndex >= 4}
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              size="lg"
              className="h-16 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
              onClick={handleDelete}
              disabled={activeIndex === 0}
            >
              <Delete className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-16 text-xl font-semibold hover:bg-secondary/80"
              onClick={() => handleNumberClick("0")}
              disabled={activeIndex >= 4}
            >
              0
            </Button>
            <div className="h-16"></div>
          </div>

          {/* Login Button */}
          <Button
            className="w-full h-12 text-base"
            onClick={handleLogin}
            disabled={activeIndex !== 4}
          >
            Unlock Application
            {activeIndex === 4 && <LogIn className="ml-2 h-4 w-4" />}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}