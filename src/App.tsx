import AppRoutes from "./routes/index.route";
import {Toaster} from "sonner"

const App = () => {
  return (
  <div className="w-[375px] h-[667px] mx-auto my-8 flex flex-col bg-background text-foreground rounded-3xl lg:border-4 lg:border-gray-400 lg:shadow-lg relative overflow-hidden">            {/* mobile notch */}
        <div className="absolute hidden lg:block top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl"></div>
      <AppRoutes />
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default App;
