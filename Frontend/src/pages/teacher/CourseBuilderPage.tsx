import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Plus, RefreshCw, Send } from "lucide-react";

import { Button } from "../../components/common/ui/Button";
import { Modal } from "../../components/common/ui/Modal";
import { ChapterForm } from "../../components/teacher/chapters/ChapterForm";
import { ChapterList } from "../../components/teacher/chapters/ChapterList";

import { chapterService } from "../../services/chapter.service";
import { courseService } from "../../services/course.service";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToastStore } from "../../store/toastStore";

import type { Chapter, CreateChapterRequest } from "../../types/chapter";
import type { Course } from "../../types/course";

export default function CourseBuilderPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

  const [deletingChapterId, setDeletingChapterId] = useState<string | null>(
    null,
  );

  const [showModal, setShowModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  const [expandedChapterId, setExpandedChapterId] = useState<string>();

  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load teacher-owned course and its chapters.
  useEffect(() => {
    let cancelled = false;

    const loadBuilderData = async () => {
      if (!courseId) {
        setLoading(false);
        setLoadError("Course ID is missing from the URL.");
        return;
      }

      try {
        setLoading(true);
        setLoadError(null);

        const [courseResult, chapterResult] = await Promise.all([
          courseService.getTeacherCourseById(courseId),
          chapterService.getChapters(courseId),
        ]);

        if (cancelled) return;

        setCourse(courseResult);

        setChapters([...chapterResult].sort((a, b) => a.order - b.order));
      } catch (error) {
        if (cancelled) return;

        const message = getApiErrorMessage(error);

        setLoadError(message);
        addToast(message, "error");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadBuilderData();

    return () => {
      cancelled = true;
    };
  }, [courseId, addToast, refreshKey]);

  // Create or update a chapter.
  const handleSaveChapter = async (data: CreateChapterRequest) => {
    if (!courseId) {
      addToast("Cannot save a chapter without a course ID.", "error");
      return;
    }

    try {
      setSaving(true);

      if (editingChapter) {
        const updated = await chapterService.updateChapter(
          courseId,
          editingChapter.chapterId,
          data,
        );

        setChapters((current) =>
          current
            .map((chapter) =>
              chapter.chapterId === updated.chapterId ? updated : chapter,
            )
            .sort((a, b) => a.order - b.order),
        );

        addToast("Chapter updated successfully", "success");
      } else {
        const created = await chapterService.createChapter(courseId, data);

        setChapters((current) =>
          [...current, created].sort((a, b) => a.order - b.order),
        );

        addToast("Chapter created successfully", "success");
      }

      setShowModal(false);
      setEditingChapter(null);
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete a chapter.
  const handleDelete = async (chapter: Chapter) => {
    if (!courseId || deletingChapterId || submitting) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${chapter.title}"?`,
    );

    if (!confirmed) return;

    try {
      setDeletingChapterId(chapter.chapterId);

      await chapterService.deleteChapter(courseId, chapter.chapterId);

      setChapters((current) =>
        current.filter((item) => item.chapterId !== chapter.chapterId),
      );

      setExpandedChapterId((current) =>
        current === chapter.chapterId ? undefined : current,
      );

      addToast("Chapter deleted successfully", "success");
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setDeletingChapterId(null);
    }
  };

  const openCreateModal = () => {
    setEditingChapter(null);
    setShowModal(true);
  };

  const openEditModal = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingChapter(null);
  };

  // Retry loading course data.
  const handleRetry = () => {
    setLoading(true);
    setLoadError(null);
    setRefreshKey((current) => current + 1);
  };

  // Navigate to lesson management.
  const handleAddLesson = (chapter: Chapter) => {
    if (!courseId) {
      addToast("Course ID is missing.", "error");
      return;
    }

    navigate(
      `/teacher/courses/${courseId}/chapters/${chapter.chapterId}/lessons`,
    );
  };

  // Submit course for admin approval.
  const handleSubmitCourse = async () => {
    if (!courseId || !course || submitting || saving) {
      return;
    }

    if (course.status !== "draft" && course.status !== "rejected") {
      addToast(
        "This course cannot be submitted in its current status.",
        "error",
      );

      setShowSubmitConfirmation(false);
      return;
    }

    try {
      setSubmitting(true);

      const submittedCourse = await courseService.submitCourse(courseId);

      setCourse(submittedCourse);
      setShowSubmitConfirmation(false);

      addToast("Course submitted for admin approval successfully.", "success");

      navigate("/teacher/courses");
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = course?.status === "draft" || course?.status === "rejected";

  const canManageContent =
    course?.status === "draft" || course?.status === "rejected";

  return (
    <div className="min-h-full bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              Back
            </Button>

            <div>
              <h1 className="text-2xl font-semibold">Course Builder</h1>

              <p className="mt-1 text-sm text-slate-400">
                Build your course structure.
              </p>

              {course && (
                <p className="mt-1 text-sm text-slate-400">
                  {course.title} · Status:{" "}
                  <span className="font-medium text-blue-400">
                    {course.status}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {canManageContent && (
              <Button
                onClick={openCreateModal}
                disabled={!courseId || loading || submitting}
              >
                <Plus size={16} />
                Add Chapter
              </Button>
            )}

            {canSubmit && (
              <Button
                onClick={() => setShowSubmitConfirmation(true)}
                disabled={loading || saving || submitting || Boolean(loadError)}
              >
                <Send size={16} />
                Submit for Approval
              </Button>
            )}

            {course?.status === "pending" && (
              <span className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
                <CheckCircle size={16} />
                Awaiting admin review
              </span>
            )}

            {course?.status === "published" && (
              <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                <CheckCircle size={16} />
                Published
              </span>
            )}
          </div>
        </header>

        {/* Rejection reason */}
        {course?.status === "rejected" && course.rejectionReason && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <h2 className="font-semibold text-red-300">Course rejected</h2>

            <p className="mt-2 whitespace-pre-line text-sm text-red-200">
              {course.rejectionReason}
            </p>

            <p className="mt-2 text-xs text-red-200/80">
              Update your course content before submitting it again.
            </p>
          </div>
        )}

        {/* Course content */}
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">Course Content</h2>

              <p className="mt-1 text-xs text-slate-500">
                Organize your course into chapters and lessons.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
              {chapters.length} {chapters.length === 1 ? "Chapter" : "Chapters"}
            </span>
          </div>

          {loading ? (
            <div
              className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center"
              role="status"
            >
              <RefreshCw
                size={22}
                className="mx-auto animate-spin text-blue-400"
              />

              <p className="mt-3 text-sm text-slate-400">
                Loading course content...
              </p>
            </div>
          ) : loadError ? (
            <div className="rounded-xl border border-red-500/20 bg-slate-900 p-8 text-center">
              <h3 className="font-medium text-red-400">
                Unable to load course content
              </h3>

              <p className="mt-2 text-sm text-slate-400">{loadError}</p>

              <div className="mt-5 flex justify-center">
                <Button variant="secondary" onClick={handleRetry}>
                  <RefreshCw size={15} />
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <ChapterList
              chapters={chapters}
              expandedChapterId={expandedChapterId}
              onToggle={(chapterId) =>
                setExpandedChapterId((current) =>
                  current === chapterId ? undefined : chapterId,
                )
              }
              onEdit={
                canManageContent
                  ? openEditModal
                  : () => {
                      addToast(
                        "This course cannot be edited in its current status.",
                        "error",
                      );
                    }
              }
              onDelete={
                canManageContent
                  ? handleDelete
                  : () => {
                      addToast(
                        "This course cannot be edited in its current status.",
                        "error",
                      );
                    }
              }
              onAddLesson={handleAddLesson}
            />
          )}
        </section>
      </div>

      {/* Chapter modal */}
      <Modal
        open={showModal}
        onClose={closeModal}
        title={editingChapter ? "Edit Chapter" : "Add Chapter"}
        description={
          editingChapter
            ? "Update your chapter details."
            : "Create a new chapter for your course."
        }
        width="md"
      >
        <ChapterForm
          initialValues={
            editingChapter
              ? {
                  title: editingChapter.title,
                  description: editingChapter.description,
                  order: editingChapter.order,
                  outcomes: editingChapter.outcomes,
                }
              : undefined
          }
          submitLabel={editingChapter ? "Save Changes" : "Create Chapter"}
          onSubmit={handleSaveChapter}
          onCancel={closeModal}
          loading={saving}
        />
      </Modal>

      {/* Submission confirmation */}
      <Modal
        open={showSubmitConfirmation}
        onClose={() => {
          if (!submitting) {
            setShowSubmitConfirmation(false);
          }
        }}
        title="Submit course for approval?"
        description="The course will be sent to the admin for review. Make sure your chapters and lessons are complete."
        width="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            {course?.title
              ? `You are submitting "${course.title}".`
              : "You are submitting this course."}
          </p>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={submitting}
              onClick={() => setShowSubmitConfirmation(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              loading={submitting}
              disabled={submitting || saving}
              onClick={() => void handleSubmitCourse()}
            >
              <Send size={16} />
              Confirm Submission
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
