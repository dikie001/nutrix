import AiChat from "@/features/ai/AI";
import CreatePassword from "@/features/onboarding/components/CreatePassword";
import Login from "@/features/onboarding/components/Login";
import Onboarding from "@/features/onboarding/Onboarding";
import ActivityTracker from "@/features/profile/ActivityTracker";
import Dashboard from "@/features/profile/Dashboard";
import Magazine from "@/features/profile/Magazine";
import Meals from "@/features/profile/Meals";
import Payments from "@/features/profile/Payements";
import Profile from "@/features/profile/Profile";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activity-tracker" element={<ActivityTracker />} />
        <Route path="/ai" element={<AiChat />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/magazines" element={<Magazine />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
