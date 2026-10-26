import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, RefreshCw } from "lucide-react";

import { Button } from "../../components/common/ui/Button";
import { Modal } from "../../components/common/ui/Modal";
import { ChapterForm } from "../../components/teacher/chapters/ChapterForm";
import { ChapterList } from "../../components/teacher/chapters/ChapterList";

import { chapterService } from "../../services/chapter.service";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToastStore } from "../../store/toastStore";

import type { Chapter, CreateChapterRequest } from "../../types/chapter";

export default function CourseBuilderPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingChapterId, setDeletingChapterId] = useState<string | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [expandedChapterId, setExpandedChapterId] = useState<string>();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadChapters = async () => {
      if (!courseId) {
        setLoading(false);
        setLoadError("Course ID is missing from the URL.");
        return;
      }

      try {
        setLoading(true);
        setLoadError(null);

        const result = await chapterService.getChapters(courseId);

        if (cancelled) {
          return;
        }

        setChapters([...result].sort((a, b) => a.order - b.order));
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message = getApiErrorMessage(error);
        setLoadError(message);
        addToast(message, "error");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadChapters();

    return () => {
      cancelled = true;
    };
  }, [courseId, addToast, refreshKey]);

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

  const handleDelete = async (chapter: Chapter) => {
    if (!courseId || deletingChapterId) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${chapter.title}"?`,
    );

    if (!confirmed) {
      return;
    }

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
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingChapter(null);
  };

  const handleRetry = () => {
    setLoading(true);
    setRefreshKey((current) => current + 1);
  };

  const handleAddLesson = (chapter: Chapter) => {
    if (!courseId) {
      addToast("Course ID is missing.", "error");
      return;
    }

    navigate(
      `/teacher/courses/${courseId}/chapters/${chapter.chapterId}/lessons`,
    );
  };

  return (
    <div className="min-h-full bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
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
            </div>
          </div>

          <Button onClick={openCreateModal} disabled={!courseId}>
            <Plus size={16} />
            Add Chapter
          </Button>
        </header>

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
              <p className="mt-3 text-sm text-slate-400">Loading chapters...</p>
            </div>
          ) : loadError ? (
            <div className="rounded-xl border border-red-500/20 bg-slate-900 p-8 text-center">
              <h3 className="font-medium text-red-400">
                Unable to load chapters
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
              onEdit={openEditModal}
              onDelete={handleDelete}
              onAddLesson={handleAddLesson}
            />
          )}
        </section>
      </div>

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
    </div>
  );
}
