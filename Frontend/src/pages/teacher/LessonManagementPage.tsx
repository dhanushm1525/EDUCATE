import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

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
  const { addToast } = useToastStore();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (!courseId || !chapterId) {
      return;
    }

    const loadLessons = async () => {
      try {
        setLoading(true);
        const result = await lessonService.getLessons(courseId, chapterId);
        setLessons(result.sort((a, b) => a.order - b.order));
      } catch (error) {
        addToast(getApiErrorMessage(error), "error");
      } finally {
        setLoading(false);
      }
    };

    void loadLessons();
  }, [courseId, chapterId, addToast]);

  const handleSave = async (data: CreateLessonRequest, videoFile?: File) => {
    if (!courseId || !chapterId) {
      return;
    }

    try {
      setSaving(true);

      /*
       * CREATE
       */
      if (!editingLesson) {
        /*
         * First create the lesson.
         *
         * We need lessonId before
         * requesting the S3 upload URL.
         */
        const created = await lessonService.createLesson(
          courseId,
          chapterId,
          data,
        );

        /*
         * If this is a video lesson,
         * upload the actual file.
         */
        if (videoFile) {
          const upload = await lessonService.generateMediaUploadUrl(
            courseId,
            chapterId,
            created.lessonId,
            {
              fileName: videoFile.name,
              contentType: videoFile.type,
            },
          );

          await lessonService.uploadMedia(upload.uploadUrl, videoFile);

          /*
           * Save the S3 key in
           * the lesson.
           */
          const updated = await lessonService.updateLesson(
            courseId,
            chapterId,
            created.lessonId,
            {
              videoUrl: upload.key,
            },
          );

          setLessons((current) =>
            [
              ...current.filter((item) => item.lessonId !== updated.lessonId),
              updated,
            ].sort((a, b) => a.order - b.order),
          );
        } else {
          setLessons((current) =>
            [...current, created].sort((a, b) => a.order - b.order),
          );
        }

        addToast("Lesson created successfully", "success");
      } else {
        /*
         * UPDATE
         */
        let updatedData = data;

        /*
         * If a new video is selected,
         * upload it first.
         */
        if (videoFile) {
          const upload = await lessonService.generateMediaUploadUrl(
            courseId,
            chapterId,
            editingLesson.lessonId,
            {
              fileName: videoFile.name,
              contentType: videoFile.type,
            },
          );

          await lessonService.uploadMedia(upload.uploadUrl, videoFile);

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

        setLessons((current) =>
          current
            .map((lesson) =>
              lesson.lessonId === updated.lessonId ? updated : lesson,
            )
            .sort((a, b) => a.order - b.order),
        );

        addToast("Lesson updated successfully", "success");
      }

      setShowModal(false);
      setEditingLesson(null);
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (lesson: Lesson) => {
    if (!courseId || !chapterId) {
      return;
    }

    const confirmed = window.confirm(`Delete "${lesson.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await lessonService.deleteLesson(courseId, chapterId, lesson.lessonId);

      setLessons((current) =>
        current.filter((item) => item.lessonId !== lesson.lessonId),
      );

      addToast("Lesson deleted successfully", "success");
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    }
  };

  const openCreate = () => {
    setEditingLesson(null);
    setShowModal(true);
  };

  const openEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingLesson(null);
  };

  return (
    <div className="min-h-full bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              Back
            </Button>

            <div>
              <h1 className="text-2xl font-semibold">Lessons</h1>
              <p className="mt-1 text-sm text-slate-400">
                Add lessons to this chapter.
              </p>
            </div>
          </div>

          <Button onClick={openCreate}>
            <Plus size={16} />
            Add Lesson
          </Button>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center text-sm text-slate-400">
            Loading lessons...
          </div>
        ) : (
          <LessonList
            lessons={lessons}
            onEdit={openEdit}
            onDelete={handleDelete}
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
            ? "Update the lesson."
            : "Create a lesson for this chapter."
        }
        width="lg"
      >
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
    </div>
  );
}