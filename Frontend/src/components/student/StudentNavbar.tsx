import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogOut, GraduationCap } from "lucide-react";

import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";
import { userService } from "../../services/user.service";
import { logger } from "../../services/logger";

import type { UserProfile } from "../../types/user";

import ProfileAvatar from "../profile/ProfileAvatar";

export function StudentNavbar() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = Boolean(accessToken);

  const { logout } = useLogout();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const response = await userService.getMyProfile();

        if (isMounted) {
          setProfile(response.data);
        }
      } catch (error) {
        logger.error("Failed to load navbar profile", { error });
      }
    };

    void fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `border-b-2 pb-1 transition ${
      isActive
        ? "border-indigo-600 text-indigo-600"
        : "border-transparent text-slate-500 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            to={isLoggedIn ? "/student" : "/"}
            className="text-xl font-black tracking-tight text-indigo-600"
          >
            EDUCATE
          </Link>

          {isLoggedIn && (
            <nav className="flex items-center gap-6 text-sm font-medium">
              <NavLink to="/student" end className={navLinkClass}>
                Home
              </NavLink>

              <NavLink to="/student/courses" className={navLinkClass}>
                Explore Courses
              </NavLink>

              <NavLink to="/student/my-courses" className={navLinkClass}>
                My Courses
              </NavLink>

              <NavLink to="/student/become-teacher" className={navLinkClass}>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap size={16} />
                  Become a Teacher
                </span>
              </NavLink>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {profile && (
                <Link
                  to="/student/profile"
                  className="transition hover:scale-105"
                  title="My Profile"
                >
                  <ProfileAvatar
                    firstName={profile.firstName}
                    lastName={profile.lastName}
                    avatar={profile.avatar}
                    size="sm"
                  />
                </Link>
              )}

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Log In
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
