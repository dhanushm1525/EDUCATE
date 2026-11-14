import AdminStats from "../../components/admin/AdminStats";
import RecentActivity from "../../components/admin/RecentActivity";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Dashboard heading */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>

        <p className="mt-1 text-sm text-slate-400">
          Overview of your EDUCATE platform.
        </p>
      </div>

      {/* Statistics */}
      <AdminStats />

      {/* Recent activity */}
      <RecentActivity />
    </div>
  );
}
