import { useEffect, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Mail,
  CalendarDays,
  ShieldAlert,
  X,
} from "lucide-react";

import { adminUserService } from "../../../services/adminUser.service";

import type { AdminUser, AdminUserStatus } from "../../../types/adminUser";

import type { UserRole } from "../../../types/userRole";

import { Button } from "../../common/ui/Button";
import { Input } from "../../common/ui/Input";
import { Select } from "../../common/ui/Select";
import { StatusBadge } from "../../common/ui/StatusBadge";
import { LoadingState } from "../../common/ui/LoadingState";
import { EmptyState } from "../../common/ui/EmptyState";
import { ErrorState } from "../../common/ui/ErrorState";

import { useToastStore } from "../../../store/toastStore";

interface AdminUserManagementProps {
  role: Extract<UserRole, "student" | "teacher">;
  title: string;
  description: string;
}

interface StatusChangeConfirmation {
  user: AdminUser;
  nextStatus: AdminUserStatus;
  action: "block" | "activate";
}

const PAGE_LIMIT = 10;

export default function AdminUserManagement({
  role,
  title,
  description,
}: AdminUserManagementProps) {
  const addToast = useToastStore((state) => state.addToast);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AdminUserStatus | "all">("all");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] =
    useState<StatusChangeConfirmation | null>(null);

  // Changing this value triggers a fresh API request.
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await adminUserService.getUsers({
          role,
          status: status === "all" ? undefined : status,
          search: search.trim() || undefined,
          page,
          limit: PAGE_LIMIT,
        });

        if (cancelled) return;

        setUsers(result.users);
        setTotal(result.total);
        setTotalPages(Math.max(1, result.totalPages));
      } catch {
        if (cancelled) return;

        setError("Unable to load users. Please try again.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [role, status, search, page, refreshKey]);

  // Opens the confirmation modal.
  const handleStatusChange = (user: AdminUser) => {
    const nextStatus: AdminUserStatus =
      user.status === "active" ? "blocked" : "active";

    const action = nextStatus === "blocked" ? "block" : "activate";

    setSelectedUser({
      user,
      nextStatus,
      action,
    });
  };

  // Executes the API request after confirmation.
  const confirmStatusChange = async () => {
    if (!selectedUser) return;

    const { user, nextStatus, action } = selectedUser;

    try {
      setUpdatingUserId(user.id);

      const updatedUser = await adminUserService.updateUserStatus(
        user.id,
        nextStatus,
      );

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === updatedUser.id ? updatedUser : currentUser,
        ),
      );

      setSelectedUser(null);

      addToast(
        `User ${action === "block" ? "blocked" : "activated"} successfully.`,
        "success",
      );
    } catch {
      addToast(`Unable to ${action} this user. Please try again.`, "error");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatus(value as AdminUserStatus | "all");
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setPage(1);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>

        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Users</p>
            <Users className="text-indigo-400" size={20} />
          </div>

          <p className="mt-3 text-2xl font-semibold text-white">{total}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Active on This Page</p>
            <UserCheck className="text-emerald-400" size={20} />
          </div>

          <p className="mt-3 text-2xl font-semibold text-white">
            {users.filter((user) => user.status === "active").length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Blocked on This Page</p>
            <UserX className="text-red-400" size={20} />
          </div>

          <p className="mt-3 text-2xl font-semibold text-white">
            {users.filter((user) => user.status === "blocked").length}
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 md:flex-row md:items-end">
        <div className="flex-1">
          <Input
            id="user-search"
            label="Search users"
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
          />
        </div>

        <div className="w-full md:w-56">
          <Select
            id="user-status"
            label="Account Status"
            value={status}
            onChange={(event) => handleStatusFilter(event.target.value)}
            options={[
              { label: "All statuses", value: "all" },
              { label: "Active", value: "active" },
              { label: "Blocked", value: "blocked" },
              { label: "Pending", value: "pending" },
            ]}
          />
        </div>

        <Button type="button" variant="secondary" onClick={handleResetFilters}>
          Reset Filters
        </Button>
      </div>

      {/* User table */}
      {loading ? (
        <LoadingState message={`Loading ${role}s...`} />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => setRefreshKey((current) => current + 1)}
        />
      ) : users.length === 0 ? (
        <EmptyState
          title={`No ${role}s found`}
          description="No users match your current search or filters."
          icon={<Search size={32} />}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="border-b border-slate-800 bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Verification
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-800/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 font-semibold text-indigo-400">
                            {user.firstName.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-white">
                            {user.firstName} {user.lastName}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                            <Mail size={12} />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        status={user.isVerified ? "Verified" : "Unverified"}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} />
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-400">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={14} />
                        {formatDate(user.createdAt)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {user.status === "pending" ? (
                        <span className="text-xs text-slate-500">
                          No action
                        </span>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant={
                            user.status === "active" ? "danger" : "primary"
                          }
                          loading={updatingUserId === user.id}
                          disabled={updatingUserId !== null}
                          onClick={() => handleStatusChange(user)}
                        >
                          {user.status === "active" ? "Block" : "Activate"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-800 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">
              Showing {total === 0 ? 0 : (page - 1) * PAGE_LIMIT + 1}
              {" - "}
              {Math.min(page * PAGE_LIMIT, total)}
              {" of "}
              {total} users
            </p>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() =>
                  setPage((currentPage) => Math.max(1, currentPage - 1))
                }
              >
                Previous
              </Button>

              <span className="px-3 text-sm text-slate-300">
                {page} / {totalPages}
              </span>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((currentPage) =>
                    Math.min(totalPages, currentPage + 1),
                  )
                }
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => {
            if (!updatingUserId) {
              setSelectedUser(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  selectedUser.action === "block"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-emerald-500/10 text-emerald-400"
                }`}
              >
                <ShieldAlert size={24} />
              </div>

              <button
                type="button"
                disabled={updatingUserId !== null}
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 transition hover:text-white disabled:opacity-50"
                aria-label="Close confirmation"
              >
                <X size={20} />
              </button>
            </div>

            <h2
              id="confirmation-title"
              className="mt-5 text-xl font-semibold text-white"
            >
              {selectedUser.action === "block"
                ? "Block this user?"
                : "Activate this user?"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Are you sure you want to{" "}
              <span
                className={
                  selectedUser.action === "block"
                    ? "font-semibold text-red-400"
                    : "font-semibold text-emerald-400"
                }
              >
                {selectedUser.action}
              </span>{" "}
              <span className="font-medium text-white">
                {selectedUser.user.firstName} {selectedUser.user.lastName}
              </span>
              ?
            </p>

            <p className="mt-3 text-sm text-slate-500">
              {selectedUser.action === "block"
                ? "This user will no longer be able to log in or access protected areas of the platform."
                : "This user will be able to log in and access the platform again."}
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                disabled={updatingUserId !== null}
                onClick={() => setSelectedUser(null)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant={selectedUser.action === "block" ? "danger" : "primary"}
                loading={updatingUserId === selectedUser.user.id}
                disabled={updatingUserId !== null}
                onClick={confirmStatusChange}
              >
                {selectedUser.action === "block"
                  ? "Confirm Block"
                  : "Confirm Activate"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
