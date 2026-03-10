import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import AdminDashboardPage from "./AdminDashboardPage";
import ReceptionistDashboardPage from "./ReceptionistDashboardPage";
import DoctorDashboardPage from "./DoctorDashboardPage";

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  switch (user?.role) {
    case "superadmin":
      return <AdminDashboardPage />;
    case "receptionist":
      return <ReceptionistDashboardPage />;
    case "doctor":
      return <DoctorDashboardPage />;
    default:
      return (
        <div className="flex items-center justify-center text-3xl text-red-500 font-semibold">
          Unauthorized
        </div>
      );
  }
};

export default DashboardPage;
