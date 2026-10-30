import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, RefreshCw } from "lucide-react";

import { Button } from "../../components/common/ui/Button";
import { Modal } from "../../components/common/ui/Modal";
import LessonForm from "../../components/teacher/lessons/LessonForm";
import { LessonList } from "../../components/teacher/lessons/LessonList";

import { lessonService } from "../../services/lesson.service";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToastStore } from "../../store/toastStore";

import type { Lesson, CreateLessonRequest } from "../../types/lesson";

type LessonMediaType = "video" | "thumbnail";

/**
 * Captures a frame from a video file and converts it into a JPEG File.
 */
const captureVideoThumbnail = async (videoFile: File): Promise<File> => {
  const video = document.createElement("video");
  const objectUrl = URL.createObjectURL(videoFile);

  video.preload = "metadata";
  video.muted = true;
  video.playsInline = true;

  try {
    const metadataLoaded = new Promise<void>((resolve, reject) => {
      video.addEventListener("loadedmetadata", () => resolve(), {
        once: true,
      });

      video.addEventListener(
        "error",
        () => reject(new Error("Unable to read the selected video.")),
        { once: true },
      );
    });

    video.src = objectUrl;
    video.load();

    await metadataLoaded;

    if (
      !Number.isFinite(video.duration) ||
      video.duration <= 0 ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      throw new Error("Unable to extract a thumbnail from this video.");
    }

    const captureTime = Math.min(2, video.duration / 2);

    const frameReady = new Promise<void>((resolve, reject) => {
      video.addEventListener("seeked", () => resolve(), {
        once: true,
      });

      video.addEventListener(
        "error",
        () => reject(new Error("Unable to seek through the video.")),
        { once: true },
      );
    });

    video.currentTime = captureTime;

    await frameReady;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to create the thumbnail image.");
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Unable to generate the thumbnail image."));
          }
        },
        "image/jpeg",
        0.85,
      );
    });

    return new File([blob], "lesson-thumbnail.jpg", {
      type: "image/jpeg",
    });
  } finally {
    video.pause();
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(objectUrl);
  }
};

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

  // Load lessons
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

  /**
   * Generates a signed upload URL and uploads lesson media.
   * Returns the S3 object key.
   */
  const uploadLessonMedia = async (
    lessonId: string,
    file: File,
    mediaType: LessonMediaType,
  ): Promise<string> => {
    if (!courseId || !chapterId) {
      throw new Error("Course ID or chapter ID is missing.");
    }

    setUploadProgress(0);

    const upload = await lessonService.generateMediaUploadUrl(
      courseId,
      chapterId,
      lessonId,
      {
        fileName: file.name,
        contentType: file.type,
        mediaType,
      },
    );

    await lessonService.uploadMedia(upload.uploadUrl, file, (percentage) =>
      setUploadProgress(percentage),
    );

    return upload.key;
  };

  /**
   * Removes uploaded media and returns keys that failed cleanup.
   */
  const cleanupUploadedMedia = async (
    lessonId: string,
    uploadedMediaKeys: string[],
  ): Promise<string[]> => {
    if (!courseId || !chapterId) return uploadedMediaKeys;

    const failures: string[] = [];

    for (const key of uploadedMediaKeys) {
      try {
        await lessonService.cleanupMedia(courseId, chapterId, lessonId, key);
      } catch {
        failures.push(key);
      }
    }

    return failures;
  };

  // Create or update lesson
  const handleSave = async (
    data: CreateLessonRequest,
    videoFile?: File,
    thumbnailFile?: File,
  ) => {
    if (!courseId || !chapterId) {
      addToast("Course ID or chapter ID is missing.", "error");
      return;
    }

    let createdLessonId: string | null = null;
    const uploadedMediaKeys: string[] = [];
    const isCreating = !editingLesson;

    try {
      setSaving(true);
      setUploadProgress(null);

      if (!editingLesson) {
        // 1. Create lesson first to obtain lesson ID.
        const created = await lessonService.createLesson(
          courseId,
          chapterId,
          data,
        );

        createdLessonId = created.lessonId;

        let savedLesson = created;

        if (created.type === "video" && videoFile) {
          // 2. Upload video.
          const videoKey = await uploadLessonMedia(
            created.lessonId,
            videoFile,
            "video",
          );

          uploadedMediaKeys.push(videoKey);

          // 3. Prefer custom thumbnail; otherwise generate from video.
          const thumbnailToUpload =
            thumbnailFile ?? (await captureVideoThumbnail(videoFile));

          // 4. Upload thumbnail.
          const thumbnailKey = await uploadLessonMedia(
            created.lessonId,
            thumbnailToUpload,
            "thumbnail",
          );

          uploadedMediaKeys.push(thumbnailKey);

          // 5. Attach video and thumbnail keys to lesson.
          savedLesson = await lessonService.updateLesson(
            courseId,
            chapterId,
            created.lessonId,
            {
              videoUrl: videoKey,
              thumbnailKey,
            },
          );

          uploadedMediaKeys.length = 0;
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
        const oldThumbnailKey = editingLesson.thumbnailKey;

        const updatedData: CreateLessonRequest = {
          ...data,
        };

        // 1. Upload replacement video if selected.
        if (videoFile) {
          const videoKey = await uploadLessonMedia(
            editingLesson.lessonId,
            videoFile,
            "video",
          );

          uploadedMediaKeys.push(videoKey);
          updatedData.videoUrl = videoKey;
        }

        // 2. Determine replacement thumbnail.
        let thumbnailToUpload: File | undefined;

        if (thumbnailFile) {
          thumbnailToUpload = thumbnailFile;
        } else if (videoFile) {
          thumbnailToUpload = await captureVideoThumbnail(videoFile);
        }

        // 3. Upload replacement thumbnail.
        if (thumbnailToUpload) {
          const thumbnailKey = await uploadLessonMedia(
            editingLesson.lessonId,
            thumbnailToUpload,
            "thumbnail",
          );

          uploadedMediaKeys.push(thumbnailKey);
          updatedData.thumbnailKey = thumbnailKey;
        }

        // 4. Save lesson and media keys.
        const updated = await lessonService.updateLesson(
          courseId,
          chapterId,
          editingLesson.lessonId,
          updatedData,
        );

        uploadedMediaKeys.length = 0;

        setLessons((current) =>
          current
            .map((lesson) =>
              lesson.lessonId === updated.lessonId ? updated : lesson,
            )
            .sort((a, b) => a.order - b.order),
        );

        // 5. Remove old media after successful update.
        const oldMediaToRemove: string[] = [];

        if (videoFile && oldVideoKey && oldVideoKey !== updated.videoKey) {
          oldMediaToRemove.push(oldVideoKey);
        }

        if (
          thumbnailToUpload &&
          oldThumbnailKey &&
          oldThumbnailKey !== updated.thumbnailKey
        ) {
          oldMediaToRemove.push(oldThumbnailKey);
        }

        if (oldMediaToRemove.length > 0) {
          const cleanupFailures = await cleanupUploadedMedia(
            editingLesson.lessonId,
            oldMediaToRemove,
          );

          if (cleanupFailures.length > 0) {
            addToast(
              "Lesson updated, but some previous media files could not be removed.",
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
      const targetLessonId = createdLessonId ?? editingLesson?.lessonId;

      // Clean up uploaded files that were not attached.
      if (targetLessonId && uploadedMediaKeys.length > 0) {
        const failures = await cleanupUploadedMedia(
          targetLessonId,
          uploadedMediaKeys,
        );

        if (failures.length > 0) {
          cleanupFailures.push("uploaded lesson media");
        }
      }

      // Roll back newly created lesson if saving fails.
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

  // Delete lesson
  const handleDelete = async () => {
    if (!courseId || !chapterId || !lessonToDelete || deletingLessonId) {
      return;
    }

    const lesson = lessonToDelete;

    try {
      setDeletingLessonId(lesson.lessonId);

      await lessonService.deleteLesson(courseId, chapterId, lesson.lessonId);

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

      {/* Add / Edit Lesson Modal */}
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
       <div className="space-y-3">
  {uploadProgress !== null && (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">
          Uploading lesson media...
        </span>
        <span className="text-blue-400">{uploadProgress}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${uploadProgress}%` }}
        />
      </div>
    </div>
  )}

  <LessonForm
    key={editingLesson?.lessonId ?? "new-lesson"}
    initialValues={
      editingLesson
        ? {
            title: editingLesson.title,
            description: editingLesson.description,
            order: editingLesson.order,
            type: editingLesson.type,
            videoUrl: editingLesson.videoKey,
            thumbnailKey: editingLesson.thumbnailKey,
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
</div>
      </Modal>

      {/* Delete Lesson Confirmation Modal */}
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

            <Button onClick={handleDelete} disabled={deletingLessonId !== null}>
              {deletingLessonId ? "Deleting..." : "Delete Lesson"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
