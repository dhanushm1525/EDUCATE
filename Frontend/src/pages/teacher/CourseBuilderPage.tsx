import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

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
  const { addToast } = useToastStore();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [expandedChapterId, setExpandedChapterId] = useState<string>();

  useEffect(() => {
    if (!courseId) {
      return;
    }

    const loadChapters = async () => {
      try {
        setLoading(true);
        const result = await chapterService.getChapters(courseId);
        setChapters(result.sort((a, b) => a.order - b.order));
      } catch (error) {
        addToast(getApiErrorMessage(error), "error");
      } finally {
        setLoading(false);
      }
    };

    void loadChapters();
  }, [courseId, addToast]);

  const handleSaveChapter = async (data: CreateChapterRequest) => {
    if (!courseId) {
      return;
    }

    try {
      setSaving(true);

      if (editingChapter) {
        const updated = await chapterService.updateChapter(
          courseId,
          editingChapter.chapterId,
          data
        );

        setChapters((current) =>
          current
            .map((chapter) =>
              chapter.chapterId === updated.chapterId ? updated : chapter
            )
            .sort((a, b) => a.order - b.order)
        );

        addToast("Chapter updated successfully", "success");
      } else {
        const created = await chapterService.createChapter(courseId, data);

        setChapters((current) =>
          [...current, created].sort((a, b) => a.order - b.order)
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
    if (!courseId) {
      return;
    }

    const confirmed = window.confirm(`Delete "${chapter.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await chapterService.deleteChapter(courseId, chapter.chapterId);

      setChapters((current) =>
        current.filter((item) => item.chapterId !== chapter.chapterId)
      );

      addToast("Chapter deleted successfully", "success");
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
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

  return (
    <div className="min-h-full bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

          <Button onClick={openCreateModal}>
            <Plus size={16} />
            Add Chapter
          </Button>
        </div>

        {/* Course structure */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Course Content</h2>
              <p className="mt-1 text-xs text-slate-500">
                Organize your course into chapters and lessons.
              </p>
            </div>

            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
              {chapters.length} {chapters.length === 1 ? "Chapter" : "Chapters"}
            </span>
          </div>

          {loading ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center text-sm text-slate-400">
              Loading chapters...
            </div>
          ) : (
            <ChapterList
              chapters={chapters}
              expandedChapterId={expandedChapterId}
              onToggle={(chapterId) =>
                setExpandedChapterId((current) =>
                  current === chapterId ? undefined : chapterId
                )
              }
              onEdit={openEditModal}
              onDelete={handleDelete}
              onAddLesson={(chapter) => {
                navigate(
                  `/teacher/courses/${courseId}/chapters/${chapter.chapterId}/lessons`
                );
              }}
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
    </div>
  );
}