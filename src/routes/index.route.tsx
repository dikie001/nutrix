import AiChat from "@/features/ai/AI";
import Onboarding from "@/features/onboarding/Onboarding";
import ActivityTracker from "@/features/profile/ActivityTracker";
import Dashboard from "@/features/profile/Dashboard";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activity-tracker" element={<ActivityTracker />} />
        <Route path="/ai" element={<AiChat />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
