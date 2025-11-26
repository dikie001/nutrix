import { useEffect } from "react";
import AppRoutes from "./routes/index.route";
import { Toaster } from "sonner";
import { USER_REGISTERED } from "./lib/constants";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  // Sense movement
  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const { x, y, z } = event.acceleration || { x: 0, y: 0, z: 0 };
      console.log("Acceleration:", x, y, z);
    };

    window.addEventListener("devicemotion", handleMotion);

    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  // Check if first time user
  useEffect(() => {
    const exists = localStorage.getItem(USER_REGISTERED) !== null;

    if (exists) {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  }, []);

  return (
    <div className="w-[375px] h-[667px] mx-auto my-8 flex flex-col bg-background text-foreground rounded-3xl lg:border-4 lg:border-gray-400 lg:shadow-lg relative overflow-hidden">
      {" "}
      {/* mobile notch */}
      <div className="absolute hidden lg:block top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl"></div>
      <AppRoutes />
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default App;
