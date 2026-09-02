import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";

import type { UserRole } from "../../types/userRole";

interface ProtectedRouteProps {
  children: ReactNode;

  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
  children,

  allowedRoles,
}: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  /*
   * User is not logged in
   */

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  /*
   * User does not have
   * permission for this route
   */

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
