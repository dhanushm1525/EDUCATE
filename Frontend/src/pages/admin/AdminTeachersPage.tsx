
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader.";
import AdminUserManagement from "../../components/admin/users/AdminUserManagement";

export default function AdminTeachersPage() {
    return (
        <div className="flex min-h-screen bg-[#0B1120]">
            <AdminSidebar />

            <div className="min-w-0 flex-1">
                <AdminHeader title="Teacher Management" />

                <main className="p-6 md:p-8">
                    <AdminUserManagement
                        role="teacher"
                        title="Teacher Management"
                        description="View, search, and manage teacher accounts."
                    />
                </main>
            </div>
        </div>
    );
}
