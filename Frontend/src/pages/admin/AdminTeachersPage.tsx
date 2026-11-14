import AdminUserManagement from "../../components/admin/users/AdminUserManagement";

export default function AdminTeachersPage() {
  return (
    <div className="text-white">
      <AdminUserManagement
        role="teacher"
        title="Teacher Management"
        description="View, search, and manage teacher accounts."
      />
    </div>
  );
}
