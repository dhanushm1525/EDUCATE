import AdminSidebar from "../../components/admin/AdminSidebar";

import AdminHeader from "../../components/admin/AdminHeader.";

import AdminStats from "../../components/admin/AdminStats";

import RecentActivity from "../../components/admin/RecentActivity";



export default function AdminDashboard() {
 
  return (
    <div
      className="
                min-h-screen
                bg-[#0B1120]
                flex
            "
    >
      {/* Sidebar */}

      <AdminSidebar />

      {/* Main Content */}

      <div
        className="
                    flex-1
                    min-w-0
                "
      >
        {/* Header */}

        <AdminHeader />

        {/* Dashboard Content */}

        <main
          className="
                        p-8
                    "
        >
          {/* Statistics */}

          <AdminStats />

          {/* Activity */}

          <div
            className="
                            mt-8
                        "
          >
            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  );
}
