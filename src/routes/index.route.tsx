import Onboarding from "@/features/onboarding/Onboarding";
import Dashboard from "@/features/profile/Dashboard";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
