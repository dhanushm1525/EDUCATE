import { useCallback, useEffect, useState } from "react";
import { RefreshCw, ClipboardCheck } from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader.";
import PendingCourseTable from "../../components/admin/courses/PendingCourseTable";
import CourseReviewModal from "../../components/admin/courses/CourseReviewModal";

import { Button } from "../../components/common/ui/Button";
import { courseService } from "../../services/course.service";
import { useToastStore } from "../../store/toastStore";
import { getApiErrorMessage } from "../../utils/apiError";

import type { Course } from "../../types/course";

export default function CourseApprovalPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingCourseId, setProcessingCourseId] = useState<string | null>(
    null,
  );

  const addToast = useToastStore((state) => state.addToast);

  const loadPendingCourses = useCallback(async (): Promise<Course[]> => {
    return courseService.getPendingCourses();
  }, []);

  const refreshPendingCourses = useCallback(async () => {
    setLoading(true);

    try {
      const result = await loadPendingCourses();
      setCourses(result);
    } catch (error: unknown) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }, [addToast, loadPendingCourses]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const result = await loadPendingCourses();

        if (!cancelled) {
          setCourses(result);
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
  }, [addToast, loadPendingCourses]);

  const handleReview = (course: Course) => {
    setSelectedCourse(course);
    setReviewModalOpen(true);
  };

  const handleCloseReview = () => {
    if (processingCourseId) {
      return;
    }

    setReviewModalOpen(false);
    setSelectedCourse(null);
  };

  const handleApprove = async (course: Course) => {
    setProcessingCourseId(course.courseId);

    try {
      await courseService.approveCourse(course.courseId);

      setCourses((current) =>
        current.filter((item) => item.courseId !== course.courseId),
      );

      setReviewModalOpen(false);
      setSelectedCourse(null);

      addToast("Course approved and published successfully.", "success");
    } catch (error: unknown) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setProcessingCourseId(null);
    }
  };

  const handleReject = async (course: Course, rejectionReason: string) => {
    setProcessingCourseId(course.courseId);

    try {
      await courseService.rejectCourse(course.courseId, rejectionReason);

      setCourses((current) =>
        current.filter((item) => item.courseId !== course.courseId),
      );

      setReviewModalOpen(false);
      setSelectedCourse(null);

      addToast("Course rejected successfully.", "success");
    } catch (error: unknown) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setProcessingCourseId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-white">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        <AdminHeader />

        <main className="p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <ClipboardCheck size={28} className="text-indigo-400" />
                <h1 className="text-2xl font-semibold">Course Approval</h1>
              </div>

              <p className="mt-2 text-sm text-slate-400">
                Review submitted courses before publishing them on EDUCATE.
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => void refreshPendingCourses()}
              loading={loading}
              disabled={Boolean(processingCourseId)}
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>

          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Awaiting review</p>
              <p className="mt-2 text-3xl font-semibold">{courses.length}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Review status</p>
              <p className="mt-2 text-sm font-medium text-amber-400">
                {loading ? "Loading courses..." : "Pending courses"}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center text-sm text-slate-400">
              Loading pending courses...
            </div>
          ) : (
            <PendingCourseTable
              courses={courses}
              onReview={handleReview}
              onApprove={(course) => void handleApprove(course)}
              onReject={handleReview}
              processingCourseId={processingCourseId}
            />
          )}
        </main>
      </div>

      {reviewModalOpen && (
        <CourseReviewModal
          key={selectedCourse?.courseId ?? "course-review"}
          course={selectedCourse}
          open={reviewModalOpen}
          onClose={handleCloseReview}
          onApprove={handleApprove}
          onReject={handleReject}
          processing={Boolean(processingCourseId)}
        />
      )}
    </div>
  );
}
