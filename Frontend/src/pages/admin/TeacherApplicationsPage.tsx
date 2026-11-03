import { useCallback, useEffect, useState } from "react";
import { RefreshCw, GraduationCap, Clock, Users } from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader.";

import PendingTeacherApplicationTable from "../../components/admin/teacherApplications/PendingTeacherApplicationTable";
import TeacherApplicationReviewModal from "../../components/admin/teacherApplications/TeacherApplicationReviewModal";

import { Button } from "../../components/common/ui/Button";

import { teacherApplicationService } from "../../services/teacherApplication.service";

import { useToastStore } from "../../store/toastStore";
import { getApiErrorMessage } from "../../utils/apiError";

import type { TeacherApplication } from "../../types/teacherApplication";

export default function TeacherApplicationsPage() {
  const [applications, setApplications] = useState<TeacherApplication[]>([]);

  const [selectedApplication, setSelectedApplication] =
    useState<TeacherApplication | null>(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [processingApplicationId, setProcessingApplicationId] = useState<
    string | null
  >(null);

  const addToast = useToastStore((state) => state.addToast);

  // Fetch pending applications

  const loadPendingApplications = useCallback(async () => {
    return teacherApplicationService.getPendingApplications();
  }, []);

  const refreshApplications = useCallback(async () => {
    setLoading(true);

    try {
      const result = await loadPendingApplications();
      setApplications(result);
    } catch (error: unknown) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }, [addToast, loadPendingApplications]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const result = await loadPendingApplications();

        if (!cancelled) {
          setApplications(result);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          addToast(getApiErrorMessage(error), "error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [addToast, loadPendingApplications]);

  // Open review modal

  const handleReview = (application: TeacherApplication) => {
    setSelectedApplication(application);
    setReviewModalOpen(true);
  };

  const handleCloseReview = () => {
    if (processingApplicationId) {
      return;
    }

    setReviewModalOpen(false);
    setSelectedApplication(null);
  };

  // Approve application

  const handleApprove = async (application: TeacherApplication) => {
    setProcessingApplicationId(application.applicationId);

    try {
      await teacherApplicationService.approveApplication(
        application.applicationId,
      );

      setApplications((current) =>
        current.filter(
          (item) => item.applicationId !== application.applicationId,
        ),
      );

      setReviewModalOpen(false);
      setSelectedApplication(null);

      addToast(
        `${application.applicant.firstName}'s teacher application approved successfully.`,
        "success",
      );
    } catch (error: unknown) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setProcessingApplicationId(null);
    }
  };

  // Reject application

  const handleReject = async (
    application: TeacherApplication,
    rejectionReason: string,
  ) => {
    setProcessingApplicationId(application.applicationId);

    try {
      await teacherApplicationService.rejectApplication(
        application.applicationId,
        rejectionReason,
      );

      setApplications((current) =>
        current.filter(
          (item) => item.applicationId !== application.applicationId,
        ),
      );

      setReviewModalOpen(false);
      setSelectedApplication(null);

      addToast(
        `${application.applicant.firstName}'s teacher application rejected.`,
        "success",
      );
    } catch (error: unknown) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setProcessingApplicationId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-white">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        <AdminHeader title="Teacher Applications" />

        <main className="p-6 lg:p-8">
          {/* Page Header */}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <GraduationCap size={28} className="text-indigo-400" />

                <h1 className="text-2xl font-semibold">Teacher Applications</h1>
              </div>

              <p className="mt-2 text-sm text-slate-400">
                Review student applications and manage requests to become
                teachers on EDUCATE.
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => void refreshApplications()}
              loading={loading}
              disabled={Boolean(processingApplicationId)}
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>

          {/* Statistics */}

          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">Awaiting review</p>

                <Clock size={20} className="text-amber-400" />
              </div>

              <p className="mt-2 text-3xl font-semibold">
                {applications.length}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">Review status</p>

                <Users size={20} className="text-indigo-400" />
              </div>

              <p className="mt-2 text-sm font-medium text-amber-400">
                {loading
                  ? "Loading applications..."
                  : applications.length > 0
                    ? "Pending applications"
                    : "All applications reviewed"}
              </p>
            </div>
          </div>

          {/* Applications Table */}

          {loading ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center text-sm text-slate-400">
              Loading pending teacher applications...
            </div>
          ) : (
            <PendingTeacherApplicationTable
              applications={applications}
              onReview={handleReview}
              processingApplicationId={processingApplicationId}
            />
          )}
        </main>
      </div>

      {/* Review Modal */}

      {reviewModalOpen && (
        <TeacherApplicationReviewModal
          key={
            selectedApplication?.applicationId ?? "teacher-application-review"
          }
          application={selectedApplication}
          open={reviewModalOpen}
          onClose={handleCloseReview}
          onApprove={handleApprove}
          onReject={handleReject}
          processing={Boolean(processingApplicationId)}
        />
      )}
    </div>
  );
}
