import { useEffect, useState } from "react";

import { chapterService } from "../services/chapter.service";
import { courseService } from "../services/course.service";
import { lessonService } from "../services/lesson.service";
import { useToastStore } from "../store/toastStore";
import { getApiErrorMessage } from "../utils/apiError";

import type { Chapter, CreateChapterRequest } from "../types/chapter";
import type { Course } from "../types/course";
import type { Lesson } from "../types/lesson";

export function useCourseBuilder(courseId: string | undefined) {
  const addToast = useToastStore((state) => state.addToast);
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessonsByChapter, setLessonsByChapter] = useState<Record<string, Lesson[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingChapterId, setDeletingChapterId] = useState<string | null>(null);
  const [expandedChapterId, setExpandedChapterId] = useState<string | undefined>();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

        const sortedChapters = [...chapterResult].sort((a, b) => a.order - b.order);
        const lessonResults = await Promise.all(
          sortedChapters.map(async (chapter) => {
            const lessons = await lessonService.getLessons(courseId, chapter.chapterId);
            return [chapter.chapterId, [...lessons].sort((a, b) => a.order - b.order)] as const;
          }),
        );
        if (cancelled) return;

        setCourse(courseResult);
        setChapters(sortedChapters);
        setLessonsByChapter(Object.fromEntries(lessonResults));
      } catch (error) {
        if (cancelled) return;
        const message = getApiErrorMessage(error);
        setLoadError(message);
        addToast(message, "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadBuilderData();
    return () => {
      cancelled = true;
    };
  }, [courseId, addToast, refreshKey]);

  const saveChapter = async (
    data: CreateChapterRequest,
    editingChapter: Chapter | null,
  ): Promise<boolean> => {
    if (!courseId) {
      addToast("Cannot save a chapter without a course ID.", "error");
      return false;
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
            .map((chapter) => (chapter.chapterId === updated.chapterId ? updated : chapter))
            .sort((a, b) => a.order - b.order),
        );
        addToast("Chapter updated successfully", "success");
      } else {
        const created = await chapterService.createChapter(courseId, data);
        setChapters((current) => [...current, created].sort((a, b) => a.order - b.order));
        setLessonsByChapter((current) => ({
          ...current,
          [created.chapterId]: [],
        }));
        addToast("Chapter created successfully", "success");
      }
      return true;
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteChapter = async (chapter: Chapter): Promise<void> => {
    if (!courseId || deletingChapterId || submitting) return;

    try {
      setDeletingChapterId(chapter.chapterId);
      await chapterService.deleteChapter(courseId, chapter.chapterId);
      setChapters((current) => current.filter((item) => item.chapterId !== chapter.chapterId));
      setLessonsByChapter((current) => {
        const updated = { ...current };
        delete updated[chapter.chapterId];
        return updated;
      });
      setExpandedChapterId((current) => (current === chapter.chapterId ? undefined : current));
      addToast("Chapter deleted successfully", "success");
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setDeletingChapterId(null);
    }
  };

  const submitCourse = async (): Promise<boolean> => {
    if (!courseId || !course || submitting || saving) return false;
    if (course.status !== "draft" && course.status !== "rejected") {
      addToast("This course cannot be submitted in its current status.", "error");
      return false;
    }

    try {
      setSubmitting(true);
      const submittedCourse = await courseService.submitCourse(courseId);
      setCourse(submittedCourse);
      addToast("Course submitted for admin approval successfully.", "success");
      return true;
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
    retryLoading: () => {
      setLoading(true);
      setLoadError(null);
      setRefreshKey((current) => current + 1);
    },
  };
}
