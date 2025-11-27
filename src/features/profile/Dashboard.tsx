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

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const { x, y, z } = event.acceleration || { x: 0, y: 0, z: 0 };
      
      // Handle null values
      const accelX = x ?? 0;
      const accelY = y ?? 0;
      const accelZ = z ?? 0;
      
      setMotion({ x: accelX, y: accelY, z: accelZ });
      
      // Calculate magnitude of acceleration
      const mag = Math.sqrt(accelX ** 2 + accelY ** 2 + accelZ ** 2);
      setMagnitude(mag);
      
      // Keep rolling window of last 20 readings
      motionHistory.current.push({ mag, time: Date.now(), x: accelX, y: accelY, z: accelZ });
      if (motionHistory.current.length > 20) {
        motionHistory.current.shift();
      }
      
      // Classify activity
      classifyActivity(mag, motionHistory.current);
    };

    const classifyActivity = (currentMag: number, history: MotionHistoryItem[]) => {
      if (history.length < 10) {
        setActivity("Calibrating...");
        return;
      }
      
      // Calculate statistics
      const magnitudes = history.map(h => h.mag);
      const avgMag = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
      const variance = magnitudes.reduce((sum, val) => sum + Math.pow(val - avgMag, 2), 0) / magnitudes.length;
      const stdDev = Math.sqrt(variance);
      
      // Detect peaks for step counting (simple peak detection)
      const now = Date.now();
      if (currentMag > avgMag + stdDev * 1.5 && now - lastPeakTime.current > 300) {
        if (avgMag > 0.5) {
          setStepCount(prev => prev + 1);
          lastPeakTime.current = now;
        }
      }
      
      // Calculate variation rate
      const recentMags = magnitudes.slice(-5);
      const maxRecent = Math.max(...recentMags);
      const minRecent = Math.min(...recentMags);
      const range = maxRecent - minRecent;
      
      // Activity classification based on magnitude and variation
      if (avgMag < 0.3 && stdDev < 0.2) {
        setActivity("At Rest");
      } else if (avgMag >= 0.3 && avgMag < 1.0 && stdDev < 0.5) {
        setActivity("Walking");
      } else if (avgMag >= 1.0 && avgMag < 2.5 && stdDev >= 0.5) {
        setActivity("Running");
      } else if (range > 3.0 || currentMag > 4.0) {
        setActivity("Jumping");
      } else if (avgMag >= 2.5 || stdDev > 1.5) {
        setActivity("Strenuous Activity");
      } else {
        setActivity("Light Movement");
      }
    };

    const init = async () => {
      // Type assertion for iOS permission API
      type DeviceMotionEventWithPermission = typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

      const DME = DeviceMotionEvent as DeviceMotionEventWithPermission;

      if (typeof DME?.requestPermission === "function") {
        try {
          const res = await DME.requestPermission();
          if (res !== "granted") {
            setActivity("Permission Denied");
            return;
          }
        } catch (err) {
          setActivity("Permission Error");
          return;
        }
      }

      window.addEventListener("devicemotion", handleMotion);
    };

    init();

    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  const getActivityColor = (): string => {
    switch (activity) {
      case "At Rest": return "text-blue-600";
      case "Walking": return "text-green-600";
      case "Running": return "text-orange-600";
      case "Jumping": return "text-purple-600";
      case "Strenuous Activity": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getActivityIcon = (): JSX.Element => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="w-6 h-6" />
            Activity Tracker
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Current Activity */}
          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-inner">
            <div className="flex justify-center mb-3">
              <div className={`${getActivityColor()}`}>
                {getActivityIcon()}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Current Activity</h3>
            <p className={`text-2xl font-bold ${getActivityColor()}`}>
              {activity}
            </p>
          </div>

          {/* Step Counter */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Steps Detected</span>
              <span className="text-2xl font-bold text-indigo-600">{stepCount}</span>
            </div>
          </div>

          {/* Motion Magnitude */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Motion Intensity</span>
              <span className="text-lg font-semibold text-gray-900">
                {magnitude.toFixed(2)} m/s²
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((magnitude / 5) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Acceleration Details */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">Acceleration Data</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xs font-medium text-red-700 mb-1">X-Axis</div>
                <div className="text-lg font-bold text-red-900">{motion.x.toFixed(2)}</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xs font-medium text-green-700 mb-1">Y-Axis</div>
                <div className="text-lg font-bold text-green-900">{motion.y.toFixed(2)}</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xs font-medium text-blue-700 mb-1">Z-Axis</div>
                <div className="text-lg font-bold text-blue-900">{motion.z.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            Move your device to see activity detection in action
          </div>
        </CardContent>
      </Card>
    </div>
  );
}