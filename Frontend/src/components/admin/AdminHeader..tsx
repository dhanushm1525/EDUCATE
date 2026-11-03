import { Bell, Search } from "lucide-react";

interface AdminHeaderProps {
  title?: string;
}

export default function AdminHeader({
  title = "Admin Dashboard",
}: AdminHeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-[#0B1120] px-8">
      {/* Title */}
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>

        <p className="mt-1 text-sm text-slate-400">Welcome back, Admin</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-5">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <input
            placeholder="Search..."
            className="w-56 rounded-lg border border-slate-700 bg-[#111827] py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="cursor-pointer text-slate-400 transition hover:text-white"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            A
          </div>

          <div className="hidden md:block">
            <p className="text-sm text-white">Administrator</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
