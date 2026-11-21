import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Plus, RefreshCw, Send } from "lucide-react";

import TeacherLayout from "../../components/teacher/layout/TeacherLayout";

import { Button } from "../../components/common/ui/Button";
import { Modal } from "../../components/common/ui/Modal";

import { ChapterForm } from "../../components/teacher/chapters/ChapterForm";
import { ChapterList } from "../../components/teacher/chapters/ChapterList";

import { useCourseBuilder } from "../../hooks/useCourseBuilder";

import type { Chapter, CreateChapterRequest } from "../../types/chapter";

export default function CourseBuilderPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const {
    course,
    chapters,
    lessonsByChapter,
    loading,
    saving,
    submitting,
    deletingChapterId,
    expandedChapterId,
    setExpandedChapterId,
    loadError,
    addToast,
    saveChapter,
    deleteChapter,
    submitCourse,
    retryLoading,
  } = useCourseBuilder(courseId);

  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  // --------------------------------------------------
  // Create or update chapter
  // --------------------------------------------------
  const handleSaveChapter = async (data: CreateChapterRequest) => {
    if (await saveChapter(data, editingChapter)) {
      setShowModal(false);
      setEditingChapter(null);
    }
  };

  // --------------------------------------------------
  // Delete chapter
  // --------------------------------------------------
  const handleDelete = async (chapter: Chapter) => {
    if (!courseId || deletingChapterId || submitting) {
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete "${chapter.title}"?`);
    if (!confirmed) return;

    await deleteChapter(chapter);
  };

  // --------------------------------------------------
  // Chapter modal handlers
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Retry loading
  // --------------------------------------------------
  const handleRetry = () => {
    retryLoading();
  };

  // --------------------------------------------------
  // Navigate to lesson management
  // --------------------------------------------------
  const handleAddLesson = (chapter: Chapter) => {
    if (!courseId) {
      addToast("Course ID is missing.", "error");
      return;
    }

    navigate(`/teacher/courses/${courseId}/chapters/${chapter.chapterId}/lessons`);
  };

  // --------------------------------------------------
  // Submit course for approval
  // --------------------------------------------------
  const handleSubmitCourse = async () => {
    if (!courseId || !course || submitting || saving) {
      return;
    }

    if (course.status !== "draft" && course.status !== "rejected") {
      addToast("This course cannot be submitted in its current status.", "error");
      setShowSubmitConfirmation(false);
      return;
    }

    if (await submitCourse()) {
      setShowSubmitConfirmation(false);
      navigate("/teacher/courses");
    }
  };

  // --------------------------------------------------
  // Permissions
  // --------------------------------------------------
  const canSubmit = course?.status === "draft" || course?.status === "rejected";
  const canManageContent = course?.status === "draft" || course?.status === "rejected";

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <TeacherLayout
      mainClassName="min-h-screen flex flex-col bg-[#0B1120] p-8"
      contentClassName="flex min-h-[calc(100vh-4rem)] w-full max-w-none flex-col"
    >
      {/* Full-height page container */}
      <div className="flex flex-1 flex-col bg-[#0B1120] text-white">
        {/* Main content */}
        <main className="w-full flex-1">
          <div className="mx-auto w-full max-w-5xl">
            {/* Header */}
            <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                  <ArrowLeft size={16} />
                  Back
                </Button>

                <div>
                  <h1 className="text-2xl font-semibold">Course Builder</h1>
                  <p className="mt-1 text-sm text-slate-400">Build your course structure.</p>

                  {course && (
                    <p className="mt-1 text-sm text-slate-400">
                      {course.title} · Status:{" "}
                      <span className="font-medium text-blue-400">{course.status}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {canManageContent && (
                  <Button onClick={openCreateModal} disabled={!courseId || loading || submitting}>
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
                  <RefreshCw size={22} className="mx-auto animate-spin text-blue-400" />
                  <p className="mt-3 text-sm text-slate-400">Loading course content...</p>
                </div>
              ) : loadError ? (
                <div className="rounded-xl border border-red-500/20 bg-slate-900 p-8 text-center">
                  <h3 className="font-medium text-red-400">Unable to load course content</h3>
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
                  lessonsByChapter={lessonsByChapter}
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
                          addToast("This course cannot be edited in its current status.", "error");
                        }
                  }
                  onDelete={
                    canManageContent
                      ? handleDelete
                      : () => {
                          addToast("This course cannot be edited in its current status.", "error");
                        }
                  }
                  onAddLesson={handleAddLesson}
                />
              )}
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto w-full border-t border-slate-800 bg-[#0B1120] px-6 py-5">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 sm:flex-row">
            <span className="text-sm font-bold tracking-wide text-blue-400">EDUCATE</span>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} EDUCATE Learning Platform. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* Chapter modal */}
      <Modal
        open={showModal}
        onClose={closeModal}
        title={editingChapter ? "Edit Chapter" : "Add Chapter"}
        description={
          editingChapter ? "Update your chapter details." : "Create a new chapter for your course."
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
    </TeacherLayout>
  );
}
