import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";

import { getRoleDashboardPath } from "../../utils/getRoleDashboardPath";

export default function PublicRoute() {
  const user = useAuthStore((state) => state.user);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  /*
   * Logged-in users should not
   * access public authentication pages.
   */

  if (isAuthenticated && user) {
    return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
}
