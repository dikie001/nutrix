import { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, TrendingUp, User } from "lucide-react";
import { OnboardingNavbar } from "../../components/Navbar";

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
  const [motion, setMotion] = useState<MotionData>({ x: 0, y: 0, z: 0 });
  const [activity, setActivity] = useState<ActivityType>("Initializing...");
  const [magnitude, setMagnitude] = useState<number>(0);
  const [stepCount, setStepCount] = useState<number>(0);

  // history of recent magnitudes & data
  const motionHistory = useRef<MotionHistoryItem[]>([]);
  const lastPeakTime = useRef<number>(0);

  // gravity filter state (low-pass)
  const gravityX = useRef(0);
  const gravityY = useRef(0);
  const gravityZ = useRef(0);

  // smoothing for instantaneous magnitude (low-pass)
  const smoothedMag = useRef(0);

  // alpha constants
  const GRAVITY_ALPHA = 0.98; // slow update for gravity (removes gravity reliably)
  const MAG_SMOOTH_ALPHA = 0.15; // smooth magnitude to reduce noise

  // Activity debounce: require stable classification for a short time / repeated windows
  const pendingActivity = useRef<ActivityType | null>(null);
  const pendingSince = useRef<number>(0);

  // Utility: compute average and std for window of mags
  const computeStats = (arr: number[]) => {
    if (arr.length === 0) return { avg: 0, std: 0 };
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    const std = Math.sqrt(
      arr.map((v) => (v - avg) ** 2).reduce((a, b) => a + b, 0) / arr.length
    );
    return { avg, std };
  };

  // Classify but return result rather than set directly (we will debounce)
  const classifyActivityImmediate = (history: MotionHistoryItem[]) => {
    if (history.length < 12) return "Calibrating..." as ActivityType;

    const mags = history.map((h) => h.mag);
    const { avg, std } = computeStats(mags);
    const now = Date.now();

    // dynamic peak threshold: based on recent noise
    const noiseFloor = Math.max(std * 2.5, 0.7); // baseline threshold
    const peakThreshold = Math.max(1.2, noiseFloor);

    // Step detection: require a clear peak (instantaneous magnitude) and spacing
    const lastMag = history[history.length - 1].mag;
    if (lastMag > peakThreshold && now - lastPeakTime.current > 400) {
      // Require that the recent window shows a positive std (not purely jitter)
      if (std > 0.12) {
        setStepCount((prev) => prev + 1);
        lastPeakTime.current = now;
      }
    }

    // Determine activity using tuned thresholds on avg and std
    // Note: mags are gravity-removed and smoothed, so thresholds are conservative
    if (avg < 0.12 && std < 0.08) return "At Rest";
    if (avg < 0.4 && std < 0.25) return "Light Movement";
    if (avg < 1.0 && std < 0.5) return "Walking";
    if (avg < 2.0 && std < 1.0) return "Running";
    if (avg >= 2.0 && std >= 1.0) return "Strenuous Activity";

    // Jumping detection: short bursts where instantaneous mags exceed higher threshold
    // If we see multiple high peaks in short period, mark as jumping
    const recentPeaks = history.filter((h) => h.mag > 2.2).length;
    if (recentPeaks >= 2) return "Jumping";

    // fallback
    return "Light Movement";
  };

  // Debounce activity updates to avoid rapid toggling:
  // Only commit a new activity if it remains the same for at least STABLE_MS or seen repeatedly.
  const STABLE_MS = 700; // how long the classification must remain before committing

  const maybeSetActivity = (candidate: ActivityType) => {
    const now = Date.now();
    if (candidate === activity) {
      // reset pending if candidate equals current
      pendingActivity.current = null;
      pendingSince.current = 0;
      return;
    }

    if (pendingActivity.current !== candidate) {
      pendingActivity.current = candidate;
      pendingSince.current = now;
      return;
    }

    // same pending candidate repeated - check time
    if (now - pendingSince.current >= STABLE_MS) {
      setActivity(candidate);
      pendingActivity.current = null;
      pendingSince.current = 0;
    }
  };

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity || {
        x: 0,
        y: 0,
        z: 0,
      };

      // Low-pass filter to estimate gravity
      const gx = GRAVITY_ALPHA * gravityX.current + (1 - GRAVITY_ALPHA) * (acc.x ?? 0);
      const gy = GRAVITY_ALPHA * gravityY.current + (1 - GRAVITY_ALPHA) * (acc.y ?? 0);
      const gz = GRAVITY_ALPHA * gravityZ.current + (1 - GRAVITY_ALPHA) * (acc.z ?? 0);

      const x = (acc.x ?? 0) - gx;
      const y = (acc.y ?? 0) - gy;
      const z = (acc.z ?? 0) - gz;

      // update gravity refs
      gravityX.current = gx;
      gravityY.current = gy;
      gravityZ.current = gz;

      // instantaneous magnitude (gravity removed)
      const mag = Math.sqrt(x * x + y * y + z * z);

      // smooth magnitude to reduce jitter
      smoothedMag.current = MAG_SMOOTH_ALPHA * mag + (1 - MAG_SMOOTH_ALPHA) * smoothedMag.current;

      setMotion({ x, y, z });
      setMagnitude(smoothedMag.current);

      motionHistory.current.push({
        mag: smoothedMag.current,
        time: Date.now(),
        x,
        y,
        z,
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

      // Reset state for a fresh session
      gravityX.current = 0;
      gravityY.current = 0;
      gravityZ.current = 0;
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
  }, []); // run only once

  const getActivityColor = () => {
    switch (activity) {
      case "At Rest":
        return "text-blue-600";
      case "Walking":
        return "text-green-600";
      case "Running":
        return "text-orange-600";
      case "Jumping":
        return "text-purple-600";
      case "Strenuous Activity":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getActivityIcon = () => {
    switch (activity) {
      case "Running":
      case "Strenuous Activity":
        return <TrendingUp className="w-6 h-6" />;
      case "Walking":
      case "Light Movement":
        return <User className="w-6 h-6" />;
      default:
        return <Activity className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <OnboardingNavbar currentLang="en" onLanguageChange={() => alert()} />
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="w-6 h-6" />
            Activity Tracker
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col mb-4">
            <div className="col-span-1 md:col-span-1 text-center p-6 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg shadow-inner">
              <div className="flex justify-center mb-3">
                <div className={`${getActivityColor()} p-2 rounded-full bg-white/60`}>
                  {getActivityIcon()}
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Current Activity
              </h3>
              <p className={`text-2xl font-bold ${getActivityColor()}`}>
                {activity}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {activity === "Calibrating..." ? "Gathering sensor baseline..." : ""}
              </p>
            </div>

            <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Steps Detected</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {stepCount}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Detected peaks using smoothed acceleration; small shakes are filtered out.
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">
                    Motion Intensity
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {magnitude.toFixed(2)} m/s²
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-linear-to-r from-green-500 to-red-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((magnitude / 5) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Smoothed magnitude shown. Smoothing and thresholds reduce false positives.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">
              Acceleration Data
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xs font-medium text-red-700 mb-1">
                  X-Axis
                </div>
                <div className="text-lg font-bold text-red-900">
                  {motion.x.toFixed(2)}
                </div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xs font-medium text-green-700 mb-1">
                  Y-Axis
                </div>
                <div className="text-lg font-bold text-green-900">
                  {motion.y.toFixed(2)}
                </div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xs font-medium text-blue-700 mb-1">
                  Z-Axis
                </div>
                <div className="text-lg font-bold text-blue-900">
                  {motion.z.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            Move your device to see activity detection in action
          </div>
        </CardContent>
      </Card>
    </div>
  );
}