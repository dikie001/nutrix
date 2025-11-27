import { USER_REGISTERED } from "@/lib/constants";
import AppRoutes from "@/routes/index.route";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";


const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const excludedRoutes = [
    "/login",
    "/ai",
    "/dashboard",
    "/payments",
    "/activity-tracker",
    "/contact",
    "/create-password",
    "/meals",
    "/profile",
  ];

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
    <div className="w-full h-screen flex justify-center items-center bg-background text-foreground">

      {/* PHONE FRAME */}
      <div className="relative w-[375px] h-[667px] rounded-3xl border border-gray-400 shadow-lg overflow-hidden">

        {/* NOTCH */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50 hidden lg:block"></div>

        {/* SCROLLABLE APP CONTENT */}
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
          <AppRoutes />
          <Toaster richColors position="top-center" />
        </div>

      </div>
    </div>
  );
};

export default App;
