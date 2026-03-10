import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export function AuthRedirect({ children }) {
  const { user } = useAuthStore();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function ProtectedRoute({ children }) {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
}

export function ProtectedRoutedRole({ children, role }) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
