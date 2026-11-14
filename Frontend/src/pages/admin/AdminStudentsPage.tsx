import AdminUserManagement from "../../components/admin/users/AdminUserManagement";

export default function AdminStudentsPage() {
  return (
    <div className="text-white">
      <AdminUserManagement
        role="student"
        title="Student Management"
        description="View, search, and manage student accounts."
      />
    </div>
  );
}
