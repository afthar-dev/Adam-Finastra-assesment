import { Toaster } from "react-hot-toast";
import AppRouter from "./routes/Approuter";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-medium text-gray-600">
          Authenticating...
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <AppRouter />
    </>
  );
};

export default App;
