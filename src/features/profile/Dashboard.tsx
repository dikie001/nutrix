import { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, TrendingUp, User } from "lucide-react";

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

export default function Dashboard() {
  const [motion, setMotion] = useState<MotionData>({ x: 0, y: 0, z: 0 });
  const [activity, setActivity] = useState<ActivityType>("Initializing...");
  const [magnitude, setMagnitude] = useState<number>(0);
  const [stepCount, setStepCount] = useState<number>(0);

  const motionHistory = useRef<MotionHistoryItem[]>([]);
  const lastPeakTime = useRef<number>(0);

  // FIX: persistent filtered gravity values
  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastZ = useRef(0);

  const alpha = 0.8;

  const classifyActivity = (mag: number, history: MotionHistoryItem[]) => {
    if (history.length < 12) {
      setActivity("Calibrating...");
      return;
    }

    const mags = history.map((h) => h.mag);
    const avg = mags.reduce((a, b) => a + b, 0) / mags.length;
    const std = Math.sqrt(
      mags.map((m) => (m - avg) ** 2).reduce((a, b) => a + b, 0) / mags.length
    );

    const now = Date.now();

    // Step detection
    if (mag > 1.2 && std > 0.25 && now - lastPeakTime.current > 350) {
      setStepCount((prev) => prev + 1);
      lastPeakTime.current = now;
    }

    if (avg < 0.08 && std < 0.05) setActivity("At Rest");
    else if (avg < 0.25 && std < 0.12) setActivity("Light Movement");
    else if (avg < 0.8 && std < 0.35) setActivity("Walking");
    else if (avg < 1.8 && std < 0.9) setActivity("Running");
    else if (avg > 1.8 && std > 1.0) setActivity("Strenuous Activity");
    else setActivity("Jumping");
  };

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity || {
        x: 0,
        y: 0,
        z: 0,
      };

      // High-pass filter (remove gravity)
      const gx = alpha * lastX.current + (1 - alpha) * (acc.x ?? 0);
      const gy = alpha * lastY.current + (1 - alpha) * (acc.y ?? 0);
      const gz = alpha * lastZ.current + (1 - alpha) * (acc.z ?? 0);

      const x = (acc.x ?? 0) - gx;
      const y = (acc.y ?? 0) - gy;
      const z = (acc.z ?? 0) - gz;

      // update ref values
      lastX.current = gx;
      lastY.current = gy;
      lastZ.current = gz;

      setMotion({ x, y, z });

      const mag = Math.sqrt(x * x + y * y + z * z);
      setMagnitude(mag);

      motionHistory.current.push({ mag, time: Date.now(), x, y, z });
      if (motionHistory.current.length > 25) motionHistory.current.shift();

      classifyActivity(mag, motionHistory.current);
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

      window.addEventListener("devicemotion", handleMotion);
    };

    init();

    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

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
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="w-6 h-6" />
            Activity Tracker
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="text-center p-6 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg shadow-inner">
            <div className="flex justify-center mb-3">
              <div className={getActivityColor()}>{getActivityIcon()}</div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Current Activity
            </h3>
            <p className={`text-2xl font-bold ${getActivityColor()}`}>
              {activity}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Steps Detected</span>
              <span className="text-2xl font-bold text-indigo-600">
                {stepCount}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Motion Intensity</span>
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
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">
              Acceleration Data
            </h3>
            <div className="grid grid-cols-3 gap-3">
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
