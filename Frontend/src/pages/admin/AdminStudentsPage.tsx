
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader.";
import AdminUserManagement from "../../components/admin/users/AdminUserManagement";

export default function AdminStudentsPage() {
    return (
        <div className="flex min-h-screen bg-[#0B1120]">
            <AdminSidebar />

            <div className="min-w-0 flex-1">
                <AdminHeader title="Student Management" />

                <main className="p-6 md:p-8">
                    <AdminUserManagement
                        role="student"
                        title="Student Management"
                        description="View, search, and manage student accounts."
                    />
                </main>
            </div>
        </div>
    );
}
