import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuthStore } from "../store/useAuthStore";

const MainLayout = () => {
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen bg-slate-50 flex ">
      <Sidebar role={user?.role} />
      <main className="flex-1 overflow-hidden lg:ml-64 mt-5">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
