import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { USER_REGISTERED } from "./lib/constants";
import AppRoutes from "./routes/index.route";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const excludedRoutes = ["/login", "/ai", "/dashboard", "/payments", "/activity-tracker","/contact", "/create-password", "/meals", "/profile"]; // routes to ignore
  
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
    if (excludedRoutes.includes(location.pathname)) return;

    const exists = localStorage.getItem(USER_REGISTERED) !== null;

    if (exists) {
      navigate("/login");
    } else {
      navigate("/onboarding");
    }
  }, [location.pathname, navigate]);

  return (
    <div className="md:w-[375px] md:h-[667px] mx-auto md:my-8 flex flex-col bg-background text-foreground rounded-3xl md:border-4 md:border-gray-400 lg:shadow-lg relative overflow-hidden">
      {/*mobile notch */}
      <div className="absolute hidden lg:block top-0 z-60 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl"></div>
      <AppRoutes />
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default App;
