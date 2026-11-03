import {
  LayoutDashboard,
  BookOpen,
  Tags,
  Settings,
  LogOut,
  User,
  GraduationCap,
  Users,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    name: "Student Management",
    icon: GraduationCap,
    path: "/admin/students",
  },
  {
    name: "Teacher Management",
    icon: Users,
    path: "/admin/teachers",
  },
  {
    name: "Course Approval",
    icon: BookOpen,
    path: "/admin/courses/pending",
  },
  {
    name: "Categories",
    icon: Tags,
    path: "/admin/categories",
  },
];

export default function AdminSidebar() {
  const { logout } = useLogout();

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-800 bg-[#0B1120]">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-800 px-7">
        <h1 className="text-xl font-bold text-white">
          EDU<span className="text-indigo-500">CATE</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) => `
                flex w-full items-center gap-3 rounded-lg px-4 py-3
                text-sm transition
                ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Settings & Actions */}
      <div className="space-y-2 border-t border-slate-800 p-4">
        <NavLink
          to="/admin/profile"
          className={({ isActive }) => `
            flex w-full items-center gap-3 rounded-lg px-4 py-3
            text-sm transition
            ${
              isActive
                ? "bg-indigo-500/10 text-indigo-400"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }
          `}
        >
          <User className="h-5 w-5" />
          Profile
        </NavLink>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <Settings className="h-5 w-5" />
          Settings
        </button>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
