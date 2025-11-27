import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Activity, Footprints, Gauge, Move, TrendingUp, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  | "Calibrating..."
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
  const [motion, setMotion] = useState<MotionData>({ x: 0, y: 0, z: 0 });
  const [activity, setActivity] = useState<ActivityType>("Initializing...");
  const [magnitude, setMagnitude] = useState<number>(0);
  const [stepCount, setStepCount] = useState<number>(0);

  const motionHistory = useRef<MotionHistoryItem[]>([]);
  const lastPeakTime = useRef<number>(0);
  const gravityX = useRef(0);
  const gravityY = useRef(0);
  const gravityZ = useRef(0);
  const smoothedMag = useRef(0);
  const pendingActivity = useRef<ActivityType | null>(null);
  const pendingSince = useRef<number>(0);

  // Constants
  const GRAVITY_ALPHA = 0.98;
  const MAG_SMOOTH_ALPHA = 0.15;
  const STABLE_MS = 700;

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
    if (history.length < 12) return "Calibrating..." as ActivityType;

    const mags = history.map((h) => h.mag);
    const { avg, std } = computeStats(mags);
    const now = Date.now();

    const noiseFloor = Math.max(std * 2.5, 0.7);
    const peakThreshold = Math.max(1.2, noiseFloor);

    // Step Detection
    const lastMag = history[history.length - 1].mag;
    if (lastMag > peakThreshold && now - lastPeakTime.current > 400) {
      if (std > 0.12) {
        setStepCount((prev) => prev + 1);
        lastPeakTime.current = now;
      }
    }

    // Activity Classification
    if (avg < 0.12 && std < 0.08) return "At Rest";
    if (avg < 0.4 && std < 0.25) return "Light Movement";
    if (avg < 1.0 && std < 0.5) return "Walking";
    if (avg < 2.0 && std < 1.0) return "Running";
    if (avg >= 2.0 && std >= 1.0) return "Strenuous Activity";

    const recentPeaks = history.filter((h) => h.mag > 2.2).length;
    if (recentPeaks >= 2) return "Jumping";

    return "Light Movement";
  };

  const maybeSetActivity = (candidate: ActivityType) => {
    const now = Date.now();
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

  // --- Effect: Motion Listener ---
  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };

      // Gravity Filter
      const gx = GRAVITY_ALPHA * gravityX.current + (1 - GRAVITY_ALPHA) * (acc.x ?? 0);
      const gy = GRAVITY_ALPHA * gravityY.current + (1 - GRAVITY_ALPHA) * (acc.y ?? 0);
      const gz = GRAVITY_ALPHA * gravityZ.current + (1 - GRAVITY_ALPHA) * (acc.z ?? 0);

      const x = (acc.x ?? 0) - gx;
      const y = (acc.y ?? 0) - gy;
      const z = (acc.z ?? 0) - gz;

      gravityX.current = gx;
      gravityY.current = gy;
      gravityZ.current = gz;

      // Magnitude
      const mag = Math.sqrt(x * x + y * y + z * z);
      smoothedMag.current = MAG_SMOOTH_ALPHA * mag + (1 - MAG_SMOOTH_ALPHA) * smoothedMag.current;

      setMotion({ x, y, z });
      setMagnitude(smoothedMag.current);

      motionHistory.current.push({
        mag: smoothedMag.current,
        time: Date.now(),
        x, y, z,
      });
      if (motionHistory.current.length > 40) motionHistory.current.shift();

      const candidate = classifyActivityImmediate(motionHistory.current);
      if (candidate === "Calibrating...") {
        setActivity("Calibrating...");
      } else {
        maybeSetActivity(candidate);
      }
    };

    const init = async () => {
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

      // Reset
      gravityX.current = 0; gravityY.current = 0; gravityZ.current = 0;
      smoothedMag.current = 0;
      motionHistory.current = [];
      lastPeakTime.current = 0;
      pendingActivity.current = null;
      pendingSince.current = 0;
      setActivity("Calibrating...");
      setStepCount(0);

      window.addEventListener("devicemotion", handleMotion, { passive: true });
    };

    init();
    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, []);

  // --- Visual Helpers ---
  const getActivityStyles = () => {
    switch (activity) {
      case "At Rest":
        return { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };
      case "Walking":
        return { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
      case "Running":
      case "Jumping":
      case "Strenuous Activity":
        return { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" };
      default:
        return { color: "text-muted-foreground", bg: "bg-muted", border: "border-border" };
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
        
        {/* Main Status Card */}
        <Card className={cn("overflow-hidden border-2 shadow-sm transition-colors duration-300", styles.border)}>
          <CardHeader className={cn("text-center pb-2", styles.bg)}>
            <div className="mx-auto bg-background p-4 rounded-full shadow-sm w-fit mb-2">
              <div className={cn("transition-colors duration-300", styles.color)}>
                {getActivityIcon()}
              </div>
            </div>
            <CardTitle className="text-2xl tracking-tight">{activity}</CardTitle>
            <CardDescription>
              {activity === "Calibrating..." ? "Analyzing sensor data..." : "Real-time classification"}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Steps */}
          <Card className="shadow-sm border-border/60">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Footprints className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Steps</span>
              </div>
              <div className="text-3xl font-bold tracking-tighter text-primary">
                {stepCount}
              </div>
            </CardHeader>
          </Card>

          {/* Intensity Value */}
          <Card className="shadow-sm border-border/60">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Gauge className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Intensity</span>
              </div>
              <div className="text-3xl font-bold tracking-tighter text-foreground">
                {magnitude.toFixed(1)}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Intensity Visualization */}
        <Card className="shadow-sm">
          <CardHeader className="p-4 pb-3">
            <CardTitle className="text-sm font-medium">Motion Intensity</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Progress 
              value={Math.min((magnitude / 5) * 100, 100)} 
              className="h-3" 
            />
            <p className="text-[10px] text-muted-foreground mt-2 text-right">
               m/s² (Smoothed)
            </p>
          </CardContent>
        </Card>

        {/* Raw Data */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground px-1">
            <Move className="w-4 h-4" />
            <h3 className="text-sm font-medium">Accelerometer (Gravity Removed)</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
             {/* X */}
            <div className="bg-card border rounded-lg p-3 flex flex-col items-center justify-center space-y-1 shadow-sm">
               <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-red-200 text-red-600 bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">X-Axis</Badge>
               <span className="font-mono text-sm font-bold">{motion.x.toFixed(2)}</span>
            </div>
            {/* Y */}
            <div className="bg-card border rounded-lg p-3 flex flex-col items-center justify-center space-y-1 shadow-sm">
              <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-emerald-200 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400">Y-Axis</Badge>
              <span className="font-mono text-sm font-bold">{motion.y.toFixed(2)}</span>
            </div>
            {/* Z */}
            <div className="bg-card border rounded-lg p-3 flex flex-col items-center justify-center space-y-1 shadow-sm">
              <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-blue-200 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400">Z-Axis</Badge>
              <span className="font-mono text-sm font-bold">{motion.z.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}