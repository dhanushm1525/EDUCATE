import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  FileText,
  MessageSquare,
  Wallet,
  User,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useLogout } from "../../hooks/useLogout";

const menuItems = [
  {
    name: "Dashboard",
    path: "/teacher",
    icon: LayoutDashboard,
  },

  {
    name: "My Courses",
    path: "/teacher/courses",
    icon: BookOpen,
  },

  {
    name: "Create Course",
    path: "/teacher/courses/create",
    icon: PlusCircle,
  },

  {
    name: "Assignments",
    path: "/teacher/assignments",
    icon: FileText,
  },

  {
    name: "Q&A",
    path: "/teacher/questions",
    icon: MessageSquare,
  },

  {
    name: "Wallet",
    path: "/teacher/wallet",
    icon: Wallet,
  },
];

export default function TeacherSidebar() {
    const {logout} = useLogout()
  return (
    <aside
      className="
        fixed
        left-0
        top-0
        h-screen
        w-64
        border-r
        border-slate-800
        bg-[#0F172A]
        p-5
      "
    >
      {/* Logo */}

      <div className="mb-10">
        <h1
          className="
            text-xl
            font-bold
            tracking-wide
            text-white
          "
        >
          EDUCATE
        </h1>

        <p
          className="
            mt-1
            text-xs
            text-slate-500
          "
        >
          Teacher Portal
        </p>
      </div>

      {/* Navigation */}

      <nav
        className="
          space-y-2
        "
      >
        {menuItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/teacher"}
            className={({ isActive }) =>
              `
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    transition-colors

                    ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }
                    `
            }
          >
            <Icon
              className="
                    h-4
                    w-4
                  "
            />

            {name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}

      <div
        className="
          absolute
          bottom-6
          left-5
          right-5
        "
      >
        <NavLink
          to="/teacher/profile"
          className="
            mb-2
            flex
            items-center
            gap-3
            rounded-lg
            px-3
            py-2.5
            text-sm
            text-slate-400
            hover:bg-slate-800
            hover:text-white
          "
        >
          <User
            className="
              h-4
              w-4
            "
          />
          Profile
        </NavLink>

        <button
          type="button"
          onClick={logout}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-lg
            px-3
            py-2.5
            text-sm
            text-red-400
            hover:bg-red-500/10
          "
        >
          <LogOut
            className="
              h-4
              w-4
            "
          />
          Logout
        </button>
      </div>
    </aside>
  );
}
