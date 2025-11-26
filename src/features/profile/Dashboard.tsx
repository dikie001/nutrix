/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const [motion, setMotion] = useState<any>({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const { x, y, z } = event.acceleration || { x: 0, y: 0, z: 0 };
      setMotion({ x, y, z });
    };

    // iOS requires permission
    const init = async () => {
      const DME = DeviceMotionEvent as any;

      if (typeof DME?.requestPermission === "function") {
        const res = await DME.requestPermission();
        if (res !== "granted") return;
      }

      window.addEventListener("devicemotion", handleMotion);
    };

    init();

    return () =>
      window.removeEventListener("devicemotion", handleMotion);
  }, []);

  return (
    <Card className="w-full max-w-sm mx-auto p-4">
      <CardHeader>
        <CardTitle>Device Motion</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>X:</span>
          <span>{motion.x.toFixed(3)}</span>
        </div>

        <div className="flex justify-between">
          <span>Y:</span>
          <span>{motion.y.toFixed(3)}</span>
        </div>

        <div className="flex justify-between">
          <span>Z:</span>
          <span>{motion.z.toFixed(3)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
