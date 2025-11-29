import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { USER_PAID } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Activity,
  Footprints,
  Gauge,
  Loader2,
  Lock,
  Move,
  TrendingUp,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OnboardingNavbar } from "../../components/Navbar";

// --- Types & Interfaces ---
interface MotionData {
  x: number;
  y: number;
  z: number;
}

interface MotionHistoryItem {
  mag: number;
  time: number;
  x: number;
  y: number;
  z: number;
}

type ActivityType =
  | "Initializing..."
  | "At Rest"
  | "Walking"
  | "Running"
  | "Jumping"
  | "Strenuous Activity"
  | "Light Movement"
  | "Permission Denied"
  | "Permission Error";

export default function ActivityTracker() {
  // --- State & Refs ---
  const [hasAccess, setHasAccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [motion, setMotion] = useState<MotionData>({ x: 0, y: 0, z: 0 });
  const [activity, setActivity] = useState<ActivityType>("At Rest"); // Start at Rest immediately
  const [magnitude, setMagnitude] = useState<number>(0);
  const [stepCount, setStepCount] = useState<number>(0);
  const navigate = useNavigate();

  const motionHistory = useRef<MotionHistoryItem[]>([]);
  const lastPeakTime = useRef<number>(0);
  
  // Sensor State
  const gravityX = useRef(0);
  const gravityY = useRef(0);
  const gravityZ = useRef(0);
  const isSensorInitialized = useRef(false); // New flag to prevent startup spikes
  
  const smoothedMag = useRef(0);
  const pendingActivity = useRef<ActivityType | null>(null);
  const pendingSince = useRef<number>(0);

  // Constants
  const GRAVITY_ALPHA = 0.92; // Slightly faster adaptation
  const MAG_SMOOTH_ALPHA = 0.2; 
  const STABLE_MS = 500; // Faster activity switching

  // --- Logic Helpers ---
  const computeStats = (arr: number[]) => {
    if (arr.length === 0) return { avg: 0, std: 0 };
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    const std = Math.sqrt(
      arr.map((v) => (v - avg) ** 2).reduce((a, b) => a + b, 0) / arr.length
    );
    return { avg, std };
  };

  const classifyActivityImmediate = (history: MotionHistoryItem[]) => {
    // If history is empty, return Rest immediately
    if (history.length === 0) return "At Rest";

    const mags = history.map((h) => h.mag);
    const { avg, std } = computeStats(mags);
    const now = Date.now();

    // -- Updated Step Detection (More Robust) --
    // Peak threshold needs to be high enough to avoid jitter
    const stepThreshold = 1.5; 
    const lastMag = history[history.length - 1].mag;
    
    // Simple peak detection for steps
    if (lastMag > stepThreshold && now - lastPeakTime.current > 350) {
      // Must have some variance to be a step, not just a tilt
      if (std > 0.5) {
        setStepCount((prev) => prev + 1);
        lastPeakTime.current = now;
      }
    }

    // -- Updated Classification Logic (Realistic Thresholds) --
    // 1. Check for Jumping (High impact peaks)
    const recentHighPeaks = history.filter((h) => h.mag > 10.0).length;
    if (recentHighPeaks >= 1) return "Jumping";

    // 2. Movement based on Average Magnitude (m/s^2)
    if (avg < 0.5) return "At Rest";         // Sitting/Still
    if (avg < 1.5) return "Light Movement";  // Fidgeting/Typing/Phone handling
    if (avg < 4.0) return "Walking";         // Normal Walking speed
    if (avg >= 4.0) return "Running";        // Running generates constant high force

    return "Light Movement";
  };

  const maybeSetActivity = (candidate: ActivityType) => {
    const now = Date.now();
    
    // Immediate switch for high intensity to capture starts quickly
    if ((candidate === "Jumping" || candidate === "Running") && activity !== candidate) {
        setActivity(candidate);
        pendingActivity.current = null;
        return;
    }

    if (candidate === activity) {
      pendingActivity.current = null;
      pendingSince.current = 0;
      return;
    }

    if (pendingActivity.current !== candidate) {
      pendingActivity.current = candidate;
      pendingSince.current = now;
      return;
    }

    if (now - pendingSince.current >= STABLE_MS) {
      setActivity(candidate);
      pendingActivity.current = null;
      pendingSince.current = 0;
    }
  };

  // --- Handlers ---

  const handleStartTracking = async () => {
    setIsVerifying(true);
    localStorage.setItem(USER_PAID, "true");
    toast.info("Tracking started");
    setHasAccess(true);
    setIsVerifying(false);
    initSensors();
  };

  const handleMotion = (event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
    const rawX = acc.x ?? 0;
    const rawY = acc.y ?? 0;
    const rawZ = acc.z ?? 0;

    // --- CRITICAL FIX: Immediate Gravity Initialization ---
    // Prevents "Jumping" detection when sitting down due to initial filter lag
    if (!isSensorInitialized.current) {
        gravityX.current = rawX;
        gravityY.current = rawY;
        gravityZ.current = rawZ;
        isSensorInitialized.current = true;
    }

    // Gravity Filter
    const gx = GRAVITY_ALPHA * gravityX.current + (1 - GRAVITY_ALPHA) * rawX;
    const gy = GRAVITY_ALPHA * gravityY.current + (1 - GRAVITY_ALPHA) * rawY;
    const gz = GRAVITY_ALPHA * gravityZ.current + (1 - GRAVITY_ALPHA) * rawZ;

    gravityX.current = gx;
    gravityY.current = gy;
    gravityZ.current = gz;

    // Linear Acceleration (Gravity Removed)
    const x = rawX - gx;
    const y = rawY - gy;
    const z = rawZ - gz;

    // Magnitude Calculation
    const mag = Math.sqrt(x * x + y * y + z * z);
    
    // Smooth the magnitude for display to reduce jitter numbers
    smoothedMag.current = MAG_SMOOTH_ALPHA * mag + (1 - MAG_SMOOTH_ALPHA) * smoothedMag.current;

    // Update UI State
    setMotion({ x, y, z });
    setMagnitude(smoothedMag.current);

    // History for classification
    motionHistory.current.push({
      mag: smoothedMag.current,
      time: Date.now(),
      x, y, z,
    });
    
    // Keep history short (~0.5s of data @ 60Hz)
    if (motionHistory.current.length > 30) motionHistory.current.shift();

    const candidate = classifyActivityImmediate(motionHistory.current);
    maybeSetActivity(candidate);
  };

  // Sensor functions
  const initSensors = async () => {
    type DeviceMotionEventWithPermission = typeof DeviceMotionEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    const DME = DeviceMotionEvent as DeviceMotionEventWithPermission;

    if (typeof DME?.requestPermission === "function") {
      try {
        const res = await DME.requestPermission();
        if (res !== "granted") {
          setActivity("Permission Denied");
          return;
        }
      } catch {
        setActivity("Permission Error");
        return;
      }
    }

    // Reset logic
    isSensorInitialized.current = false; // Reset init flag
    motionHistory.current = [];
    lastPeakTime.current = 0;
    pendingActivity.current = null;
    pendingSince.current = 0;
    setActivity("At Rest"); // Default to At Rest immediately
    setStepCount(0);

    window.addEventListener("devicemotion", handleMotion, { passive: true });
  };

  // Cleanup
  useEffect(() => {
    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, []);

  // Check payment
  useEffect(() => {
    const verifyUser = () => {
      const value = localStorage.getItem(USER_PAID);
      if (value === "true") {
        setHasAccess(false);
      } else {
        navigate("/payments");
      }
    };
    verifyUser();
  }, []);

  // --- Visual Helpers ---
  const getActivityStyles = () => {
    switch (activity) {
      case "At Rest":
        return {
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
        };
      case "Walking":
        return {
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
        };
      case "Running":
      case "Jumping":
      case "Strenuous Activity":
        return {
          color: "text-orange-500",
          bg: "bg-orange-500/10",
          border: "border-orange-500/20",
        };
      default:
        return {
          color: "text-muted-foreground",
          bg: "bg-muted",
          border: "border-border",
        };
    }
  };

  const getActivityIcon = () => {
    switch (activity) {
      case "Running":
      case "Strenuous Activity":
      case "Jumping":
        return <TrendingUp className="w-8 h-8" />;
      case "Walking":
      case "Light Movement":
        return <User className="w-8 h-8" />;
      default:
        return <Activity className="w-8 h-8" />;
    }
  };

  const styles = getActivityStyles();

  return (
    <div className="w-full min-h-screen mt-4 bg-background flex flex-col font-sans">
      <OnboardingNavbar currentLang="en" onLanguageChange={() => {}} />

      <div className="flex-1 w-full p-4 space-y-4 pb-10">
        {!hasAccess ? (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <div className="p-6 bg-muted/30 rounded-full border-2 border-dashed border-muted-foreground/20">
              <Lock className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2 max-w-xs">
              <h2 className="text-xl font-bold tracking-tight">
                 Activity Tracking
              </h2>
              <p className="text-sm text-muted-foreground">
                Unlock real-time motion analysis and step counting features.
              </p>
            </div>

            <Button
              onClick={handleStartTracking}
              disabled={isVerifying}
              className="w-full max-w-xs h-12 font-medium"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Start Tracking"
              )}
            </Button>
          </div>
        ) : (
          <>
            <Card
              className={cn(
                "overflow-hidden border-2 shadow-sm transition-colors duration-300",
                styles.border
              )}
            >
              <CardHeader className={cn("text-center pb-2", styles.bg)}>
                <div className="mx-auto bg-background p-4 rounded-full shadow-sm w-fit mb-2">
                  <div
                    className={cn(
                      "transition-colors duration-300",
                      styles.color
                    )}
                  >
                    {getActivityIcon()}
                  </div>
                </div>
                <CardTitle className="text-2xl tracking-tight">
                  {activity}
                </CardTitle>
                <CardDescription>
                  Real-time classification
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="shadow-sm border-border/60">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Footprints className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Steps
                    </span>
                  </div>
                  <div className="text-3xl font-bold tracking-tighter text-primary">
                    {stepCount}
                  </div>
                </CardHeader>
              </Card>

              <Card className="shadow-sm border-border/60">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Gauge className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Intensity
                    </span>
                  </div>
                  <div className="text-3xl font-bold tracking-tighter text-foreground">
                    {magnitude.toFixed(1)}
                  </div>
                </CardHeader>
              </Card>
            </div>

            <Card className="shadow-sm">
              <CardHeader className="p-4 pb-3">
                <CardTitle className="text-sm font-medium">
                  Motion Intensity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Progress
                  value={Math.min((magnitude / 8) * 100, 100)}
                  className="h-3"
                />
                <p className="text-[10px] text-muted-foreground mt-2 text-right">
                  m/s² (Linear Acceleration)
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground px-1">
                <Move className="w-4 h-4" />
                <h3 className="text-sm font-medium">
                  Accelerometer (Gravity Removed)
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-card border rounded-lg p-3 flex flex-col items-center justify-center space-y-1 shadow-sm">
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-1.5 border-red-200 text-red-600 bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                  >
                    X-Axis
                  </Badge>
                  <span className="font-mono text-sm font-bold">
                    {motion.x.toFixed(2)}
                  </span>
                </div>
                <div className="bg-card border rounded-lg p-3 flex flex-col items-center justify-center space-y-1 shadow-sm">
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-1.5 border-emerald-200 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
                  >
                    Y-Axis
                  </Badge>
                  <span className="font-mono text-sm font-bold">
                    {motion.y.toFixed(2)}
                  </span>
                </div>
                <div className="bg-card border rounded-lg p-3 flex flex-col items-center justify-center space-y-1 shadow-sm">
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-1.5 border-blue-200 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                  >
                    Z-Axis
                  </Badge>
                  <span className="font-mono text-sm font-bold">
                    {motion.z.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}