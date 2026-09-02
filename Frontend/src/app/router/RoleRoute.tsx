import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";

interface RoleRouteProps {
  allowedRoles: string[];
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    if (user.role === "student") {
      return <Navigate to="/student" replace />;
    }

    if (user.role === "teacher") {
      return <Navigate to="/teacher" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
