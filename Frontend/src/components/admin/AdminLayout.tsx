import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader.";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#0B1120] text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Header */}
        <AdminHeader />

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-800 px-6 py-5 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} EDUCATE. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
