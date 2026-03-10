import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AuthLayout from "../layout/AuthLayout";
import {
  AuthRedirect,
  ProtectedRoute,
  ProtectedRoutedRole,
} from "../utils/AuthRedirect";
import { lazy, Suspense } from "react";

// lazy loaded
const LoginPage = lazy(() => import("../pages/LoginPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const SchedulerPage = lazy(() => import("../pages/SchedulerPage"));
const AppoinmentsPage = lazy(() => import("../pages/AppoinmentsPage"));
const PatientsPage = lazy(() => import("../pages/PatientsPage"));
const UsersPage = lazy(() => import("../pages/UsersPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "scheduler",
        element: (
          <ProtectedRoutedRole role={["receptionist", "superadmin"]}>
            <Suspense fallback={<div>Loading...</div>}>
              <SchedulerPage />
            </Suspense>
          </ProtectedRoutedRole>
        ),
      },
      {
        path: "Appointments",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <AppoinmentsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "Patients",
        element: (
          <ProtectedRoutedRole role={["receptionist", "superadmin"]}>
            <Suspense fallback={<div>Loading...</div>}>
              <PatientsPage />
            </Suspense>
          </ProtectedRoutedRole>
        ),
      },
      {
        path: "Users",
        element: (
          <ProtectedRoutedRole role="superadmin">
            <Suspense fallback={<div>Loading...</div>}>
              <UsersPage />
            </Suspense>
          </ProtectedRoutedRole>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <AuthRedirect>
            <Suspense fallback={<div>Loading...</div>}>
              <LoginPage />
            </Suspense>
          </AuthRedirect>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
