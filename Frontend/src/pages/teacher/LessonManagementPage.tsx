import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, RefreshCw } from "lucide-react";

import { Button } from "../../components/common/ui/Button";
import { Modal } from "../../components/common/ui/Modal";
import { LessonForm } from "../../components/teacher/lessons/LessonForm";
import { LessonList } from "../../components/teacher/lessons/LessonList";

import { lessonService } from "../../services/lesson.service";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToastStore } from "../../store/toastStore";

import type { Lesson, CreateLessonRequest } from "../../types/lesson";

export default function LessonManagementPage() {
  const { courseId, chapterId } = useParams<{
    courseId: string;
    chapterId: string;
  }>();

  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);

  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadLessons = async () => {
      if (!courseId || !chapterId) {
        setLoading(false);
        setLoadError("Course ID or chapter ID is missing from the URL.");
        return;
      }

      try {
        setLoading(true);
        setLoadError(null);

        const result = await lessonService.getLessons(courseId, chapterId);

        if (cancelled) return;

        setLessons([...result].sort((a, b) => a.order - b.order));
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

    void loadLessons();

    return () => {
      cancelled = true;
    };
  }, [courseId, chapterId, addToast, refreshKey]);

  const handleSave = async (data: CreateLessonRequest, videoFile?: File) => {
    if (!courseId || !chapterId) {
      addToast("Course ID or chapter ID is missing.", "error");
      return;
    }

    let createdLessonId: string | null = null;
    let uploadedMediaKey: string | null = null;
    const isCreating = !editingLesson;

    try {
      setSaving(true);
      setUploadProgress(null);

      if (!editingLesson) {
        const created = await lessonService.createLesson(
          courseId,
          chapterId,
          data,
        );

        createdLessonId = created.lessonId;

        let savedLesson = created;

        if (videoFile) {
          setUploadProgress(0);

          const upload = await lessonService.generateMediaUploadUrl(
            courseId,
            chapterId,
            created.lessonId,
            {
              fileName: videoFile.name,
              contentType: videoFile.type,
            },
          );

          // Keep the key for cleanup if upload or saving fails.
          uploadedMediaKey = upload.key;

          await lessonService.uploadMedia(
            upload.uploadUrl,
            videoFile,
            (percentage) => setUploadProgress(percentage),
          );

          savedLesson = await lessonService.updateLesson(
            courseId,
            chapterId,
            created.lessonId,
            {
              videoUrl: upload.key,
            },
          );

          // The uploaded video is now attached to the lesson.
          uploadedMediaKey = null;
        }

        setLessons((current) =>
          [
            ...current.filter(
              (lesson) => lesson.lessonId !== savedLesson.lessonId,
            ),
            savedLesson,
          ].sort((a, b) => a.order - b.order),
        );

        addToast("Lesson created successfully", "success");
      } else {
        const oldVideoKey = editingLesson.videoKey;
        let updatedData = data;

        if (videoFile) {
          setUploadProgress(0);

          const upload = await lessonService.generateMediaUploadUrl(
            courseId,
            chapterId,
            editingLesson.lessonId,
            {
              fileName: videoFile.name,
              contentType: videoFile.type,
            },
          );

          uploadedMediaKey = upload.key;

          await lessonService.uploadMedia(
            upload.uploadUrl,
            videoFile,
            (percentage) => setUploadProgress(percentage),
          );

          updatedData = {
            ...data,
            videoUrl: upload.key,
          };
        }

        const updated = await lessonService.updateLesson(
          courseId,
          chapterId,
          editingLesson.lessonId,
          updatedData,
        );

        // The new video is now attached to the lesson.
        uploadedMediaKey = null;

        setLessons((current) =>
          current
            .map((lesson) =>
              lesson.lessonId === updated.lessonId ? updated : lesson,
            )
            .sort((a, b) => a.order - b.order),
        );

        // Remove the previous video only after the replacement is saved.
        if (videoFile && oldVideoKey && oldVideoKey !== updated.videoKey) {
          try {
            await lessonService.cleanupMedia(
              courseId,
              chapterId,
              editingLesson.lessonId,
              oldVideoKey,
            );
          } catch {
            addToast(
              "Lesson updated, but the previous video could not be removed.",
              "error",
            );
          }
        }

        addToast("Lesson updated successfully", "success");
      }

      setShowModal(false);
      setEditingLesson(null);
    } catch (error) {
      const cleanupFailures: string[] = [];

      // Attempt to remove an uploaded video that was not attached successfully.
      if (uploadedMediaKey) {
        const targetLessonId = createdLessonId ?? editingLesson?.lessonId;

        if (targetLessonId) {
          try {
            await lessonService.cleanupMedia(
              courseId,
              chapterId,
              targetLessonId,
              uploadedMediaKey,
            );
          } catch {
            cleanupFailures.push("the uploaded video");
          }
        }
      }

      // Roll back a newly created lesson if its save flow fails.
      if (isCreating && createdLessonId) {
        try {
          await lessonService.deleteLesson(
            courseId,
            chapterId,
            createdLessonId,
          );
        } catch {
          cleanupFailures.push("the newly created lesson");
        }
      }

      // Reload the server state in case a request succeeded but its response
      // was lost.
      setRefreshKey((current) => current + 1);

      const message = getApiErrorMessage(error);

      addToast(
        cleanupFailures.length > 0
          ? `${message} Cleanup also failed for ${cleanupFailures.join(
              " and ",
            )}. Please verify the lesson and its S3 files.`
          : message,
        "error",
      );
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  };

const handleDelete = async () => {
  if (!courseId || !chapterId || !lessonToDelete || deletingLessonId) {
    return;
  }

  const lesson = lessonToDelete;

  try {
    setDeletingLessonId(lesson.lessonId);

    await lessonService.deleteLesson(
      courseId,
      chapterId,
      lesson.lessonId,
    );

    setLessons((current) =>
      current.filter((item) => item.lessonId !== lesson.lessonId),
    );

    addToast("Lesson deleted successfully", "success");
    setLessonToDelete(null);
  } catch (error) {
    addToast(getApiErrorMessage(error), "error");
  } finally {
    setDeletingLessonId(null);
  }
};

  const openCreate = () => {
    if (saving) return;

    setEditingLesson(null);
    setUploadProgress(null);
    setShowModal(true);
  };

  const openEdit = (lesson: Lesson) => {
    if (saving) return;

    setEditingLesson(lesson);
    setUploadProgress(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingLesson(null);
    setUploadProgress(null);
  };

  const handleRetry = () => {
    setLoading(true);
    setRefreshKey((current) => current + 1);
  };

  return (
    <div className="min-h-full bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              <ArrowLeft size={16} />
              Back
            </Button>

            <div>
              <h1 className="text-2xl font-semibold">Lessons</h1>
              <p className="mt-1 text-sm text-slate-400">
                Add and organize lessons in this chapter.
              </p>
            </div>
          </div>

          <Button
            onClick={openCreate}
            disabled={!courseId || !chapterId || saving}
          >
            <Plus size={16} />
            Add Lesson
          </Button>
        </header>

        {loading ? (
          <div
            className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center"
            role="status"
          >
            <RefreshCw
              size={22}
              className="mx-auto animate-spin text-blue-400"
            />
            <p className="mt-3 text-sm text-slate-400">Loading lessons...</p>
          </div>
        ) : loadError ? (
          <div className="rounded-xl border border-red-500/20 bg-slate-900 p-8 text-center">
            <h2 className="font-medium text-red-400">Unable to load lessons</h2>
            <p className="mt-2 text-sm text-slate-400">{loadError}</p>

            <div className="mt-5 flex justify-center">
              <Button variant="secondary" onClick={handleRetry}>
                <RefreshCw size={15} />
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <LessonList
            lessons={lessons}
            onEdit={openEdit}
            onDelete={(lesson) => setLessonToDelete(lesson)}
            onAssignment={(lesson) => {
              navigate(
                `/teacher/courses/${courseId}/chapters/${chapterId}/lessons/${lesson.lessonId}/assignment`,
              );
            }}
          />
        )}
      </div>

      <Modal
        open={showModal}
        onClose={closeModal}
        title={editingLesson ? "Edit Lesson" : "Add Lesson"}
        description={
          editingLesson
            ? "Update the lesson details."
            : "Create a lesson for this chapter."
        }
        width="lg"
      >
        {uploadProgress !== null && (
          <div className="mb-5 space-y-2" role="status" aria-live="polite">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Uploading video...</span>
              <span className="font-medium text-blue-400">
                {uploadProgress}%
              </span>
            </div>

            <div
              className="h-2 w-full overflow-hidden rounded-full bg-slate-700"
              role="progressbar"
              aria-label="Video upload progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={uploadProgress}
            >
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <LessonForm
          initialValues={
            editingLesson
              ? {
                  title: editingLesson.title,
                  description: editingLesson.description,
                  order: editingLesson.order,
                  type: editingLesson.type,
                  videoUrl: editingLesson.videoKey,
                  content: editingLesson.content,
                  attachments: editingLesson.attachments,
                  duration: editingLesson.duration,
                }
              : undefined
          }
          submitLabel={editingLesson ? "Save Changes" : "Create Lesson"}
          onSubmit={handleSave}
          onCancel={closeModal}
          loading={saving}
        />


      </Modal>

      <Modal
  open={lessonToDelete !== null}
  onClose={() => {
    if (!deletingLessonId) {
      setLessonToDelete(null);
    }
  }}
  title="Delete lesson?"
  description="This action cannot be undone."
  width="sm"
>
  <div className="space-y-5">
    <p className="text-sm text-slate-300">
      Are you sure you want to delete{" "}
      <span className="font-semibold text-white">
        {lessonToDelete?.title}
      </span>
      ? The lesson and its associated content may be permanently removed.
    </p>

    <div className="flex justify-end gap-3">
      <Button
        variant="secondary"
        onClick={() => setLessonToDelete(null)}
        disabled={deletingLessonId !== null}
      >
        Cancel
      </Button>

      <Button
        onClick={handleDelete}
        disabled={deletingLessonId !== null}
      >
        {deletingLessonId ? "Deleting..." : "Delete Lesson"}
      </Button>
    </div>
  </div>
</Modal>
    </div>
  );
}
